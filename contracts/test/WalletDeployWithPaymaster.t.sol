// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import {Config} from "config/Config.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

import {IEntryPoint, UserOperation} from "account-abstraction/interfaces/IEntryPoint.sol";
import {TrueWalletFactory, WalletErrors} from "contracts/wallet/TrueWalletFactory.sol";
import {TrueWallet} from "contracts/wallet/TrueWallet.sol";
import {TrueWalletProxy} from "contracts/wallet/TrueWalletProxy.sol";
import {GHOPaymaster} from "../src/GHOPaymaster.sol";
import {IGHOPaymaster} from "../src/IGHOPaymaster.sol";
import {IGhoToken} from 'gho-core/gho/interfaces/IGhoToken.sol';
import {IPool} from 'aave-v3-core/contracts/interfaces/IPool.sol';
import {ECDSA} from "openzeppelin-contracts/utils/cryptography/ECDSA.sol";
import {ICreditDelegationToken} from 'aave-v3-core/contracts/interfaces/ICreditDelegationToken.sol';
import {DataTypes} from 'aave-v3-core/contracts/protocol/libraries/types/DataTypes.sol';
import {IWrappedTokenGatewayV3} from 'aave-v3-periphery/misc/interfaces/IWrappedTokenGatewayV3.sol';
import {IPaymaster} from "account-abstraction/interfaces/IPaymaster.sol";

contract WalletDeployWithPaymasterTest is Test {
    IEntryPoint public constant entryPoint = IEntryPoint(Config.ENTRY_POINT);
    IGhoToken public constant GHOToken = IGhoToken(Config.AAVE_GHO);
    IPool public constant pool = IPool(Config.AAVE_POOL);
    IWrappedTokenGatewayV3 public constant tokenGateway = IWrappedTokenGatewayV3(Config.AAVE_WETH_GATEWAY);

    MockERC20 public token;
    TrueWalletFactory factory;
    TrueWallet walletImpl;
    TrueWallet wallet;
    TrueWalletProxy proxy;
    GHOPaymaster paymaster;
    ICreditDelegationToken public GHOVariableDebtToken;
    DataTypes.ReserveData reserveDataResponse;

    address deployerAddress;
    uint256 deployerPrivateKey;
    address ownerAddress;
    uint256 ownerPrivateKey;

    bytes[] modules = new bytes[](0);
    bytes32 salt;

    function setUp() public {
        (deployerAddress, deployerPrivateKey) = makeAddrAndKey("deployerAddress");
        (ownerAddress, ownerPrivateKey) = makeAddrAndKey("ownerAddress");
        vm.deal(address(deployerAddress), 5 ether);

        paymaster = new GHOPaymaster(address(entryPoint), address(GHOToken), address(pool), address(deployerAddress));
        vm.deal(address(paymaster), 5 ether);
        vm.startPrank(address(deployerAddress));
        paymaster.addStake{value: 0.1 ether}(86400);
        paymaster.deposit{value: 1 ether};

        walletImpl = new TrueWallet();
        factory = new TrueWalletFactory(address(walletImpl), address(deployerAddress), address(entryPoint));
        vm.deal(address(factory), 5 ether);
        factory.addStake{value: 0.1 ether}(86400);

        bytes memory initData = abi.encode(uint32(1));
        salt = keccak256(abi.encodePacked(address(factory), address(entryPoint)));

        wallet = factory.createWallet(address(entryPoint), ownerAddress, modules, salt);
        vm.deal(address(wallet), 5 ether);
    }

    function test() public {
        UserOperation memory userOp;
        userOp = generateUserOp();

        bytes32 opHash = paymaster.getHash(userOp, 0x00000000deadbeef, 0x0000000000001234);
        bytes memory sign = createSignature(opHash, ownerPrivateKey, vm);
        userOp.paymasterAndData = abi.encodePacked(address(paymaster), abi.encode(0x00000000deadbeef, 0x0000000000001234), sign);

        vm.startPrank(address(entryPoint));
        vm.expectRevert(abi.encodeWithSelector(IGHOPaymaster.BorrowAmountIsNotEnough.selector));
        paymaster.validatePaymasterUserOp(userOp, opHash, 0);
        vm.stopPrank();

        vm.prank(address(ownerAddress));
        bytes memory payload1 = abi.encodeWithSelector(tokenGateway.depositETH.selector, address(pool), address(wallet), 0);
        wallet.execute(Config.AAVE_WETH_GATEWAY, 1000000000000000000, payload1);
        vm.stopPrank();

        reserveDataResponse = pool.getReserveData(address(GHOToken));
        GHOVariableDebtToken = ICreditDelegationToken(reserveDataResponse.variableDebtTokenAddress);

        vm.prank(address(ownerAddress));
        bytes memory payload2 = abi.encodeWithSelector(GHOVariableDebtToken.approveDelegation.selector, address(paymaster), 1000000000000000000);
        wallet.execute(address(GHOVariableDebtToken), 0, payload2);
        vm.stopPrank();

        vm.startPrank(address(entryPoint));
        // should be executed without revert
        (bytes memory context, uint256 validationData) = paymaster.validatePaymasterUserOp(userOp, opHash, 0);
        vm.stopPrank();

        vm.startPrank(address(entryPoint));
        paymaster.postOp(IPaymaster.PostOpMode.opSucceeded, context, 0);
        vm.stopPrank();
    }

    function generateUserOp() public view returns (UserOperation memory userOp) {
        // UserOperation memory userOp;

        userOp = UserOperation({
            sender: address(wallet),
            nonce: wallet.nonce(),
            initCode: "",
            callData: "",
            callGasLimit: 2_000_000,
            verificationGasLimit: 3_000_000,
            preVerificationGas: 1_000_000,
            maxFeePerGas: 1_000_105_660,
            maxPriorityFeePerGas: 1_000_000_000,
            paymasterAndData: "",
            signature: ""
        });
    }

    function createSignature(bytes32 _messageHash, uint256 _ownerPrivateKey, Vm vm) public returns (bytes memory) {
        bytes32 digest = ECDSA.toEthSignedMessageHash(_messageHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(_ownerPrivateKey, digest);
        bytes memory signature = bytes.concat(r, s, bytes1(v));
        return signature;
    }
}