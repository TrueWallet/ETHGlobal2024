// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import {IPaymaster, UserOperation} from "account-abstraction/interfaces/IPaymaster.sol";

interface IGHOPaymaster is IPaymaster {
    /// @notice Throws when the lengths of two comparable arrays or sets of data do not match.
    error BorrowAmountIsNotEnough();

    /**
     * Payment validation: check if paymaster agree to pay.
     * Must verify sender is the entryPoint.
     * Revert to reject this request.
     * Note that bundlers will reject this method if it changes the state, unless the paymaster is trusted (whitelisted)
     * The paymaster pre-pays using its deposit, and receive back a refund after the postOp method returns.
     * @param userOp the user operation
     * @param userOpHash hash of the user's request data.
     * @param maxCost the maximum cost of this transaction (based on maximum gas and gas price from userOp)
     * @return context value to send to a postOp
     *      zero length to signify postOp is not required.
     * @return validationData the last block timestamp this operation is valid, or zero if it is valid indefinitely.
     *      Note that the validation code cannot use block.timestamp (or block.number) directly.
     */
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external returns (bytes memory context, uint256 validationData);

    /// @notice Get the Paymaster stake on the entryPoint, which is used for DDOS protection.
    function getStake() external view returns (uint112);

    /// @notice Get the Paymaster deposit on the entryPoint, which is used to pay for gas.
    function getDeposit() external view returns (uint112);

    /// @notice Add a deposit for this paymaster to the entryPoint.
    function deposit() external payable;

    /// @notice Add to the account's stake - amount and delay.
    function addStake(uint32 _unstakeDelaySeconds) external payable;
}