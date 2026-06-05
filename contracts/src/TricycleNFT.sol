// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title  TricycleNFT
/// @notice One NFT per real-world electric tricycle — the on-chain
///         representation of the asset. Fractional ownership of a tricycle is
///         handled separately by FractionalInvestment (which uses this NFT's
///         tokenId as its pool id), keeping asset identity and financials
///         cleanly separated.
contract TricycleNFT is ERC721, Ownable {
    struct Meta {
        string vehicleId; // off-chain fleet identifier / VIN
        string make;
        string model;
        bool isEV;
        uint256 priceUsd; // asset value in whole USD
        uint256 rangeKm; // battery range
    }

    /// @dev tokenId => metadata.
    mapping(uint256 => Meta) public meta;

    uint256 public nextId = 1;

    event TricycleMinted(uint256 indexed id, address indexed to, string vehicleId);

    constructor(address owner_) ERC721("3rike Tricycle", "3RIKE") Ownable(owner_) {}

    /// @notice Mint a new tricycle asset NFT. Only the platform (owner) can mint.
    function mintTricycle(address to, Meta calldata m) external onlyOwner returns (uint256 id) {
        id = nextId++;
        _safeMint(to, id);
        meta[id] = m;
        emit TricycleMinted(id, to, m.vehicleId);
    }

    /// @notice True if a tricycle with this id exists.
    function exists(uint256 id) external view returns (bool) {
        return _ownerOf(id) != address(0);
    }
}
