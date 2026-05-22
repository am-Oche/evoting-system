// Simplified core vote casting logic for documentation
function castVote(uint256 _electionId, uint256 _candidateId) external {

    require(registry.isRegistered(msg.sender), "Not a registered voter");
    require(!hasVoted[_electionId][msg.sender], "Already voted");

    votes[_electionId][_candidateId]++;
    hasVoted[_electionId][msg.sender] = true;

    emit VoteCast(_electionId, _candidateId, msg.sender);

}
