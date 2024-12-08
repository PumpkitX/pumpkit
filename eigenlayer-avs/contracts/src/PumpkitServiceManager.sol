// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ECDSAServiceManagerBase} from
    "@eigenlayer-middleware/src/unaudited/ECDSAServiceManagerBase.sol";
import {ECDSAStakeRegistry} from "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import {IServiceManager} from "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {ECDSAUpgradeable} from
    "@openzeppelin-upgrades/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import {IERC1271Upgradeable} from "@openzeppelin-upgrades/contracts/interfaces/IERC1271Upgradeable.sol";
import {IPumpkitServiceManager} from "./IPumpkitServiceManager.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@eigenlayer/contracts/interfaces/IRewardsCoordinator.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

/**
 * @title Primary entrypoint for procuring services from HelloWorld.
 * @author Eigen Labs, Inc.
 */
contract PumpkitServiceManager is ECDSAServiceManagerBase, IPumpkitServiceManager {
    using ECDSAUpgradeable for bytes32;

    uint32 public latestTokenDataNum;

    mapping(uint32 => bytes32) public allTokenDataHashes;

    mapping(address => mapping(uint32 => bytes)) public allTokenDataResponses;

    modifier onlyOperator() {
        require(
            ECDSAStakeRegistry(stakeRegistry).operatorRegistered(msg.sender),
            "Operator must be the caller"
        );
        _;
    }

    constructor(
        address _avsDirectory,
        address _stakeRegistry,
        address _rewardsCoordinator,
        address _delegationManager

    )
        ECDSAServiceManagerBase(
            _avsDirectory,
            _stakeRegistry,
            _rewardsCoordinator,
            _delegationManager
        )
    {}

    /* FUNCTIONS */
    // NOTE: this function creates new token, assigns it a tokenId
    function createNewTokenData(
        string memory chain,
        string memory contractAddress
    ) external returns (TokenData memory) {
        // create a new TokenData struct
        TokenData memory newTokenData;
        newTokenData.chain = chain;
        newTokenData.contractAddress = contractAddress;
        newTokenData.tokenDataCreatedBlock = uint32(block.number);

        // store hash of TokenData onchain, emit event, and increase TokenDataNum
        allTokenDataHashes[latestTokenDataNum] = keccak256(abi.encode(newTokenData));
        emit NewTokenDataCreated(latestTokenDataNum, chain, contractAddress);
        latestTokenDataNum = latestTokenDataNum + 1;

        return newTokenData;
    }

    function respondToTokenData(
        TokenData calldata tokenData,
        bytes32 isEligible,
        uint32 referenceTokenDataIndex,
        bytes memory signature
    ) external {
        // check that the TokenData is valid, hasn't been responsed yet, and is being responded in time
        require(
            keccak256(abi.encode(tokenData)) == allTokenDataHashes[referenceTokenDataIndex],
            "supplied TokenData does not match the one recorded in the contract"
        );
        require(
            allTokenDataResponses[msg.sender][referenceTokenDataIndex].length == 0,
            "Operator has already responded to the TokenData"
        );

        // The message that was signed
        bytes32 ethSignedMessageHash = isEligible.toEthSignedMessageHash();
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        if (!(magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash,signature))){
            revert();
        }

        // updating the storage with TokenData responses
        allTokenDataResponses[msg.sender][referenceTokenDataIndex] = signature;

        // emitting event
        emit TokenDataResponded(referenceTokenDataIndex, tokenData.chain, tokenData.contractAddress,isEligible, msg.sender);
    }

        function fetchTokenDetails(
     string memory contractAddress,
        string memory chain
    ) external {
        
        emit NewTokenDetailRequested(contractAddress, chain);

    }

    function respondToTokenDetails(
        TokenData calldata tokenData,
        string memory description,
        uint32 referenceTokenDataIndex,
        bytes memory signature
    ) external {
        // The message that was signed
        bytes32 messageHash = keccak256(abi.encodePacked(description, tokenData.chain));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        if (!(magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash,signature))){
            revert();
        }

        // updating the storage with TokenData responses
        allTokenDataResponses[msg.sender][referenceTokenDataIndex] = signature;

        // emitting event
        emit TokenDetailResponded(referenceTokenDataIndex, tokenData.chain, tokenData.contractAddress,description, msg.sender);
    }
}