// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "forge-std/console.sol";

import {IEntryPoint, UserOperation} from "account-abstraction/interfaces/IEntryPoint.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {IGHOPaymaster} from "./IGHOPaymaster.sol";
import {IGhoToken} from 'gho-core/gho/interfaces/IGhoToken.sol';
import {IPool} from 'aave-v3-core/contracts/interfaces/IPool.sol';
import {DataTypes} from 'aave-v3-core/contracts/protocol/libraries/types/DataTypes.sol';
import {ICreditDelegationToken} from 'aave-v3-core/contracts/interfaces/ICreditDelegationToken.sol';
import {UserOperationLib, UserOperation} from "account-abstraction/interfaces/UserOperation.sol";

// Based on Paymaster in: https://github.com/eth-infinitism/account-abstraction
contract GHOPaymaster is IGHOPaymaster, Owned {
    using UserOperationLib for UserOperation;

    IEntryPoint public entryPoint;
    IGhoToken public GHOToken;
    ICreditDelegationToken public GHOVariableDebtToken;
    IPool public pool;

    /// @notice A minimal amount will be borrowed from the AAVE pool. In the real case, this value should be calculated
    uint256 minPaymentAmount = 1000000000000000000;
    DataTypes.ReserveData reserveDataResponse;

    mapping(address => uint256) public senderNonce;
    uint256 borrowAllowance;

    event UpdateEntryPoint(
        address indexed _newEntryPoint,
        address indexed _oldEntryPoint
    );

    event UpdateGHOToken(
        address indexed _newGHOToken,
        address indexed _oldGHOToken
    );

    event UpdatePool(
        address indexed _newPool,
        address indexed _oldPool
    );

    /// @notice Validate that only the entryPoint is able to call a method
    modifier onlyEntryPoint() {
        if (msg.sender != address(entryPoint)) {
            revert InvalidEntryPoint();
        }
        _;
    }

    /// @dev Reverts in case not valid entryPoint or owner
    error InvalidEntryPoint();

    constructor(address _entryPoint, address _GHOToken, address _pool, address _owner) Owned(_owner) {
        entryPoint = IEntryPoint(_entryPoint);
        GHOToken = IGhoToken(_GHOToken);
        pool = IPool(_pool);
    }

    /// @notice Get the total paymaster stake on the entryPoint
    function getStake() public view returns (uint112) {
        return entryPoint.getDepositInfo(address(this)).stake;
    }

    /// @notice Get the total paymaster deposit on the entryPoint
    function getDeposit() public view returns (uint112) {
        return entryPoint.getDepositInfo(address(this)).deposit;
    }

    //////////////////////// STATE-CHANGING API  /////////////////////////

    /// @notice Set the entrypoint contract, restricted to onlyOwner
    function setEntryPoint(address _newEntryPoint) external onlyOwner {
        emit UpdateEntryPoint(_newEntryPoint, address(entryPoint));
        entryPoint = IEntryPoint(_newEntryPoint);
    }

    /// @notice Set the AAVE GHO token contract, restricted to onlyOwner
    function setGHOToken(address _newGHOToken) external onlyOwner {
        emit UpdateGHOToken(_newGHOToken, address(GHOToken));
        GHOToken = IGhoToken(_newGHOToken);
    }

    /// @notice Set the AAVE pool contract, restricted to onlyOwner
    function setPool(address _newPool) external onlyOwner {
        emit UpdatePool(_newPool, address(pool));
        pool = IPool(_newPool);
    }

    ////// VALIDATE USER OPERATIONS

    /// @notice Validates that the paymaster will pay for the user transaction. Custom checks can be performed here, to ensure for example
    ///         that the user has sufficient funds to pay for the transaction. It could just return an empty context and deadline to allow
    ///         all transactions by everyone to be paid for through this paymaster.
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external override returns (bytes memory context, uint256 validationData) {
        (userOp, userOpHash, maxCost); // unused params
        reserveDataResponse = pool.getReserveData(address(GHOToken));
        GHOVariableDebtToken = ICreditDelegationToken(reserveDataResponse.variableDebtTokenAddress);
        borrowAllowance = GHOVariableDebtToken.borrowAllowance(userOp.getSender(), address(this));
        if (borrowAllowance < minPaymentAmount) revert BorrowAmountIsNotEnough();
        senderNonce[userOp.getSender()]++;
        return (abi.encodePacked(userOp.getSender()), 0);
    }

        /**
     * Return the hash we're going to sign off-chain (and validate on-chain)
     * this method is called by the off-chain service, to sign the request.
     * it is called on-chain from the validatePaymasterUserOp, to validate the signature.
     * note that this signature covers all fields of the UserOperation, except the "paymasterAndData",
     * which will carry the signature itself.
     */
    function getHash(
        UserOperation calldata userOp,
        uint48 validUntil,
        uint48 validAfter
    ) public view returns (bytes32) {
        //can't use userOp.hash(), since it contains also the paymasterAndData itself.

        return
            keccak256(
                abi.encode(
                    pack(userOp),
                    block.chainid,
                    address(this),
                    senderNonce[userOp.getSender()],
                    validUntil,
                    validAfter
                )
            );
    }

    function pack(
        UserOperation calldata userOp
    ) internal pure returns (bytes memory ret) {
        // lighter signature scheme
        bytes calldata pnd = userOp.paymasterAndData;
        // copy directly the userOp from calldata up to (but not including) the paymasterAndData.
        // this encoding depends on the ABI encoding of calldata, but is much lighter to copy
        // than referencing each field separately.
        assembly {
            let ofs := userOp
            let len := sub(sub(pnd.offset, ofs), 32)
            ret := mload(0x40)
            mstore(0x40, add(ret, add(len, 32)))
            mstore(ret, len)
            calldatacopy(add(ret, 32), ofs, len)
        }
    }

    /// @notice Handler for charging the sender (smart wallet) for the transaction after it has been paid for by the paymaster
    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external onlyEntryPoint {
        (mode, context, actualGasCost); // unused params
        pool.borrow(address(GHOToken), minPaymentAmount, 2, 0, address(uint160(bytes20(context))));
    }

    ///// STAKE MANAGEMENT

    /// @notice Add stake for this paymaster to the EntryPoint. Used to allow the paymaster to operate and prevent DDOS
    function addStake(uint32 _unstakeDelaySeconds) external payable onlyOwner {
        entryPoint.addStake{value: msg.value}(_unstakeDelaySeconds);
    }

    /// @notice Unlock paymaster stake
    function unlockStake() external onlyOwner {
        entryPoint.unlockStake();
    }

    /// @notice Withdraw paymaster stake, after having unlocked
    function withdrawStake(address payable to) external onlyOwner {
        entryPoint.withdrawStake(to);
    }

    ///// DEPOSIT MANAGEMENT

    /// @notice Add a deposit for this paymaster to the EntryPoint. Deposit is used to pay user gas fees
    function deposit() external payable {
        entryPoint.depositTo{value: msg.value}(address(this));
    }

    /// @notice Withdraw paymaster deposit to an address
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        entryPoint.withdrawTo(to, amount);
    }

    /// @notice Withdraw all paymaster deposit to an address
    function withdrawAll(address payable to) external onlyOwner {
        uint112 totalDeposit = getDeposit();
        entryPoint.withdrawTo(to, totalDeposit);
    }
}