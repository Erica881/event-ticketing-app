// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTTic is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTaken;
    mapping(uint256 => uint256) public escrowBalance;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }


    function mint(uint256 _id) public payable {
        require(_id != 0 && _id <= totalOccasions, "Invalid occasion ID");
        require(msg.value >= occasions[_id].cost, "Insufficient ETH sent");
        require(occasions[_id].tickets > 0, "Sold out");
        require(!hasBought[_id][msg.sender], "Already purchased");

        // Find the next available seat (from 1 to maxTickets)
        uint256 seatToAssign = 0;
        for (uint256 i = 1; i <= occasions[_id].maxTickets; i++) {
            if (seatTaken[_id][i] == address(0)) {
                seatToAssign = i;
                break;
            }
        }

        require(seatToAssign != 0, "No available seats");

        occasions[_id].tickets--;
        hasBought[_id][msg.sender] = true;
        seatTaken[_id][seatToAssign] = msg.sender;
        seatsTaken[_id].push(seatToAssign);

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }


    // function getOccasion(uint256 _id) public view returns (Occasion memory) {
    //     return occasions[_id];
    // }
    function getAllOccasions() public view returns (Occasion[] memory) {
        Occasion[] memory allOccasions = new Occasion[](totalOccasions);
        for (uint256 i = 1; i <= totalOccasions; i++) {
            allOccasions[i - 1] = occasions[i];
        }
        return allOccasions;
    }


    function getRangedOccasions(uint256 start, uint256 end) public view returns (Occasion[] memory) {
        require(end >= start, "Invalid range");
        require(end <= totalOccasions, "Out of range");

        Occasion[] memory pagedOccasions = new Occasion[](end - start + 1);
        uint256 index = 0;

        for (uint256 i = start; i <= end; i++) {
            pagedOccasions[index] = occasions[i];
            index++;
        }

        return pagedOccasions;
    }


    // function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
    //     return seatsTaken[_id];
    // }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
