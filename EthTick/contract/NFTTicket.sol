// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTTic is ERC721 {
    address public owner;
    uint256 public totalEvents;
    uint256 public totalSupply;

    struct Event {
        uint256 id;
        string name;
        string date;
        string time;
        string location;
        string desc;
        uint256 cost;
        uint256 maxTickets;
        bool isFree;
        string imageUrl;
        bool isCompleted;
        bool isCancelled;
        address organizer;
    }

    mapping(uint256 => Event) events;
    mapping(uint256 => uint256) public escrowBalance;

    event EventListed(uint256 id, string name, uint256 cost);
    event TicketMinted(uint256 eventId, uint256 tokenId, address buyer, uint256 cost);
    event EventCompleted(uint256 id);
    event EventCancelled(uint256 id);
    event RefundClaimed(uint256 id, address buyer, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location,
        string memory _imageUrl,
        string memory _desc
    ) public {
        totalEvents++;
        events[totalEvents] = Event(
            totalEvents,
            _name,
            _date,
            _time,
            _location,
            _desc,
            _cost,
            _maxTickets,
            _cost == 0,     
            _imageUrl,
            false,
            false,
            msg.sender
        );

        emit EventListed(totalEvents, _name, _cost);
    }

    function getEventsByOrganizer(address _organizer) public view returns (Event[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= totalEvents; i++) {
            if (events[i].organizer == _organizer) {
                count++;
            }
        }

        Event[] memory result = new Event[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= totalEvents; i++) {
            if (events[i].organizer == _organizer) {
                result[index] = events[i];
                index++;
            }
        }

        return result;
    }

    function mint(uint256 _id) public payable {
        Event storage eventInfo = events[_id];
        
        require(_id != 0 && _id <= totalEvents, "Invalid event ID");
        require(msg.value == eventInfo.cost , "Please pay exact amount");
        require(!eventInfo.isCancelled, "Event was cancelled");

        escrowBalance[_id] += msg.value;
        totalSupply++;
        eventInfo.maxTickets -= 1;
        uint tokenId = totalSupply;
        _safeMint(msg.sender, tokenId);
        emit TicketMinted(_id, tokenId, msg.sender, eventInfo.cost);
    }

    function completeEvent(uint256 _id) public {
        Event storage occ = events[_id];
        require(msg.sender == occ.organizer, "Not organizer");
        require(!occ.isCancelled, "Already cancelled");
        require(!occ.isCompleted, "Already completed");

        occ.isCompleted = true;
        uint256 amount = escrowBalance[_id];
        escrowBalance[_id] = 0;
        (bool success, ) = occ.organizer.call{value: amount}("");
        require(success, "Transfer failed");

        emit EventCompleted(_id);
    }

    function cancelEvent(uint256 _id) public {
        Event storage occ = events[_id];
        require(msg.sender == occ.organizer, "Not organizer");
        require(!occ.isCompleted, "Already completed");
        require(!occ.isCancelled, "Already cancelled");

        occ.isCancelled = true;

        emit EventCancelled(_id);
    }

    function claimRefund(uint256 _id) public {
        Event storage occ = events[_id];
        require(occ.isCancelled, "Event is not cancelled");

        uint256 refundAmount = occ.cost;
        escrowBalance[_id] -= refundAmount;

        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundClaimed(_id, msg.sender, refundAmount);
    }

    function getAllEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](totalEvents);
        for (uint256 i = 1; i <= totalEvents; i++) {
            allEvents[i - 1] = events[i];
        }
        return allEvents;
    }

    function getRangedEvents(uint256 start, uint256 end) public view returns (Event[] memory) {
        require(end >= start, "Invalid range");
        require(end <= totalEvents, "Out of range");

        Event[] memory pagedEvents = new Event[](end - start + 1);
        uint256 index = 0;

        for (uint256 i = start; i <= end; i++) {
            pagedEvents[index] = events[i];
            index++;
        }

        return pagedEvents;
    }

    function getEscrowBalance(uint256 _id) public view returns (uint256) {
        return escrowBalance[_id];
    }

}