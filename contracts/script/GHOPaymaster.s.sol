// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import {Config} from "../config/Config.sol";
import {GHOPaymaster} from "src/GHOPaymaster.sol";

contract GHOPaymasterScript is Script {
    GHOPaymaster public paymaster;
    address public entryPoint;

    address public ownerAddress;
    uint256 public ownerPrivateKey;
    address public GHOToken;
    address public pool;

    function setUp() public {
        ownerAddress = vm.envAddress("OWNER_ADDRESS");
        ownerPrivateKey = vm.envUint("OWNER_PRIVATE_KEY");
        entryPoint = Config.ENTRY_POINT;
        GHOToken = Config.AAVE_GHO;
        pool = Config.AAVE_POOL;
    }

    function run() public {
        vm.startBroadcast(ownerPrivateKey);
        paymaster = new GHOPaymaster(entryPoint, GHOToken, pool, ownerAddress);
        paymaster.addStake{value: 0.1 ether}(86400);
        vm.stopBroadcast();
    }
}
