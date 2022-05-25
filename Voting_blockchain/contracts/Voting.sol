// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;

contract Ballot {
   
    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address vote;   // address of the candidate he voted for
    }

    struct Candidate {
        string name;   // candidate name 
        address caaddress; //candidate address
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Candidate[] public candidates;
    
    enum State { Created, Voting, Ended } // State of voting period
    
    State public state;

    constructor() {
        chairperson = msg.sender;
        //voters[chairperson].weight = 1;
        state = State.Ended;
        
        /*for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
            constructor(string[] memory candidateNames)
        }*/
    }
    
    // MODIFIERS
    modifier onlySmartContractOwner() {
        require(
            msg.sender == chairperson,
            "Only chairperson can start and end the voting"
        );
        _;
    }
    
    /*modifier CreatedState() {
        require(state == State.Created, "it must be in Started");
        _;
    }*/
    
    modifier VotingState() {
        require(state == State.Voting, "it must be in Voting Period");
        _;
    }
    
    modifier EndedState() {
        require(state == State.Ended, "it must be in Ended Period");
        _;
    }
    
    //add candidate
    function addCandidates(address candidateaddress,string memory candidateName) 
        public 
        payable
        EndedState
    {
        uint temp=1;
        for (uint i = 0; i < candidates.length; i++)
        {
            if(candidates[i].caaddress==candidateaddress)
            {
                temp=0;
            }
        }
        require(
            temp==1,
            "This candidate has already been added"
        );
        candidates.push(Candidate({
            name: candidateName,
            caaddress: candidateaddress,
            voteCount: 0
        }));
    }
    
    // start vote
    function startVote() 
        public
        onlySmartContractOwner
    {
        state = State.Voting;
    }
    
   //end vote
    function endVote() 
        public 
        onlySmartContractOwner
    {
        state = State.Ended;
    }
    
    
    //right to vote
    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }
    
    //to add voter
    function addVoter(address voter) public{
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        voters[voter]=Voter({weight:1,voted:false,vote:0x0000000000000000000000000000000000000000});
    }

    //vote
    function vote(address candidate,address voter) 
        public
        VotingState
    {
        Voter storage sender = voters[voter];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;


        for (uint i = 0; i < candidates.length; i++)
        {
            if(candidates[i].caaddress==candidate)
            {
                sender.vote = candidate;
                candidates[i].voteCount += sender.weight;
            }
        }
    }

    //winning list
    function winningCandidate() 
        public
        view
        EndedState
        returns (Candidate[] memory )
    { 
        return candidates;
    }
}