// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IPumpkitServiceManager {
    
    event NewTokenDataCreated(uint32 indexed tokenDataIndex, string chain,string contractAddress);
    event TokenDataResponded(uint32 indexed tokenDataIndex, string chain,string contractAddress, bytes32 isEligible, address operator);
    event NewTokenDetailRequested(string contractAddress, string chainName);
    event TokenDetailResponded(uint32 indexed tokenDataIndex, string chainName,string contractAddress, string description, address operator);

    struct TokenData {
        string chain;
        string contractAddress;
        uint32 tokenDataCreatedBlock;
    }

    function latestTokenDataNum() external view returns (uint32);

    function allTokenDataHashes(
        uint32 tokenDataIndex
    ) external view returns (bytes32);

    function allTokenDataResponses(
        address operator,
        uint32 tokenDataIndex
    ) external view returns (bytes memory);

    function createNewTokenData(
        string memory chain,
        string memory contractAddress
    ) external returns (TokenData memory);

    function respondToTokenData(
        TokenData calldata tokenData,
        bytes32 isEligible,
        uint32 referenceTokenDataIndex,
        bytes calldata signature
    ) external;

    function fetchTokenDetails(
        string memory contractAddress,
        string memory chainName
    ) external;

    function respondToTokenDetails( TokenData calldata tokenData,
        string memory description,
        uint32 referenceTokenDataIndex,
        bytes calldata signature
    ) external;
}