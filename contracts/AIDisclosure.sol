//stores AI-usage disclosures for content on the blockchain using a unique hash as the identifier. It ensures each piece of content is recorded once, along with who created it, whether AI was used, and related metadata.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AIDisclosure {

    struct Disclosure {
        bytes32 contentHash;
        bool aiUsed;
        string aiToolName;       // e.g. "ChatGPT", "Claude", "Midjourney"
        string aiUsageType;      // e.g. "fully generated", "assisted", "edited"
        address creator;
        uint256 timestamp;
        string metadataURI;      // optional IPFS link to full content
        bool exists;
    }

    // contentHash => Disclosure
    mapping(bytes32 => Disclosure) public disclosures;

    // creator => list of their content hashes
    mapping(address => bytes32[]) public creatorHistory;

    event DisclosureRecorded(
        bytes32 indexed contentHash,
        address indexed creator,
        bool aiUsed,
        string aiToolName,
        uint256 timestamp
    );

    /**
     * @notice Record an AI disclosure for a piece of content
     * @param contentHash SHA-256 hash of the content (as bytes32)
     * @param aiUsed Whether AI was used
     * @param aiToolName Name of the AI tool used (empty string if none)
     * @param aiUsageType How AI was used (empty string if none)
     * @param metadataURI Optional IPFS URI pointing to full content
     */
    function recordDisclosure(
        bytes32 contentHash,
        bool aiUsed,
        string calldata aiToolName,
        string calldata aiUsageType,
        string calldata metadataURI
    ) external {
        require(contentHash != bytes32(0), "Invalid content hash");
        require(!disclosures[contentHash].exists, "Disclosure already recorded for this content");

        disclosures[contentHash] = Disclosure({
            contentHash: contentHash,
            aiUsed: aiUsed,
            aiToolName: aiToolName,
            aiUsageType: aiUsageType,
            creator: msg.sender,
            timestamp: block.timestamp,
            metadataURI: metadataURI,
            exists: true
        });

        creatorHistory[msg.sender].push(contentHash);

        emit DisclosureRecorded(
            contentHash,
            msg.sender,
            aiUsed,
            aiToolName,
            block.timestamp
        );
    }

    /**
     * @notice Verify a disclosure by content hash
     */
    function verifyDisclosure(bytes32 contentHash)
        external
        view
        returns (
            bool exists,
            bool aiUsed,
            string memory aiToolName,
            string memory aiUsageType,
            address creator,
            uint256 timestamp,
            string memory metadataURI
        )
    {
        Disclosure storage d = disclosures[contentHash];
        return (
            d.exists,
            d.aiUsed,
            d.aiToolName,
            d.aiUsageType,
            d.creator,
            d.timestamp,
            d.metadataURI
        );
    }

    /**
     * @notice Get all content hashes submitted by a creator
     */
    function getCreatorHistory(address creator)
        external
        view
        returns (bytes32[] memory)
    {
        return creatorHistory[creator];
    }
}
