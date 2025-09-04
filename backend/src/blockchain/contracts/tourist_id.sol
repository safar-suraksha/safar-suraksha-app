// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TouristID {
    struct IDRecord {
        address tourist;
        string dataHash; // hash of ID + itinerary
        uint256 timestamp;
    }

    mapping(address => IDRecord) public records;

    event IDRegistered(address indexed tourist, string dataHash, uint256 timestamp);

    function registerID(string memory _dataHash) public {
        records[msg.sender] = IDRecord(msg.sender, _dataHash, block.timestamp);
        emit IDRegistered(msg.sender, _dataHash, block.timestamp);
    }

    function getID(address _tourist) public view returns (IDRecord memory) {
        return records[_tourist];
    }
}
