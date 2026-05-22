CHAPTER FOUR

IMPLEMENTATION AND TESTING / RESULTS AND DISCUSSION

This chapter presents the implementation of the blockchain-based e-voting system designed and specified in the preceding chapter. It documents the development environment, system interfaces, database structure, smart contract deployment, and testing procedures conducted to validate the system's functionality, security, and performance. The artefact produced is a fully functional web-based decentralised application (dApp) that integrates NIN-based identity verification, WebAuthn biometric authentication, and Ethereum smart contracts for immutable vote recording.

4.1 System Requirements

The VoteChain E-Voting System is a decentralised application that integrates traditional web technologies with blockchain infrastructure. To ensure optimal performance during development, testing, and future deployment, the following minimum system specifications are outlined below.

4.1.1 Hardware Requirements

The system was developed and tested on a Windows 11 machine. The following hardware specifications represent the minimum and recommended configurations for running the application:



Component

Minimum

Recommended

Processor

Intel Core i3 or equivalent dual-core

Intel Core i5 or higher

RAM

4GB

8GB or more

Storage

20GB available space

256GB SSD

Display

1366 x 768 resolution

1920 x 1080 or higher

Network

Stable internet connection

Broadband (10Mbps+)

Input Device

Standard keyboard and mouse

Biometric-capable device for WebAuthn



The recommended specifications are particularly important for developers running the local Hardhat blockchain node, PostgreSQL database server, and React development server simultaneously on the same machine.

4.1.2 Software Requirements

The following software components were installed prior to development on the aforementioned development machine:



Software

Version

Purpose

Node.js

v22.17.0

JavaScript runtime for backend and tooling

PostgreSQL

v15

Relational database for structured application data

Hardhat

v2.22

Local Ethereum development and testing network

React.js with TypeScript

v18

Frontend user interface library

Ethers.js

v6

Ethereum smart contract interaction library

Prisma ORM

v6

Database schema management and query builder

Visual Studio Code

Latest

Primary code editor

Git

Latest

Version control system

Chrome / Edge / Brave

Latest

Browser with WebAuthn and MetaMask support



The browser requirement is critical, as WebAuthn-based biometric authentication relies on the browser's native credential management API, which is fully supported in Chromium-based browsers.

4.2 Implementation

The implementation phase involved setting up the decentralised blockchain infrastructure, configuring the relational database, developing the smart contracts, and building the user-facing interfaces. The system was developed incrementally using an adapted Agile (Scrum) methodology, with each sprint delivering a functional module that was tested before proceeding to the next.

4.2.1 System Architecture

The VoteChain system follows a hybrid decentralised architecture. While the core voting logic resides on-chain through Solidity smart contracts, the application utilises a traditional backend and relational database for efficient data retrieval, user management, and off-chain metadata storage. This hybrid approach ensures that the system remains responsive and scalable whilst maintaining the immutability and transparency guarantees of blockchain technology.

The architecture is organised into four distinct layers:

Presentation Layer: The React.js frontend, built with Vite and Tailwind CSS, provides responsive user interfaces accessible through modern web browsers.

Application Layer: The Node.js and Express.js backend handles business logic, API requests, NIN verification, and communication with both the database and blockchain.

Data Layer: The PostgreSQL database, managed through Prisma ORM, stores voter profiles, election configurations, candidate information, WebAuthn credentials, and authentication logs.

Blockchain Layer: Solidity smart contracts deployed on the local Hardhat Ethereum node handle voter registration status, vote recording, duplicate prevention, and result tallying.

[Insert Figure 4.1 — System Architecture Diagram here.]

Figure 4.1: System Architecture of the VoteChain E-Voting Application

4.2.2 Voter Registration Interface

The voter registration module is the entry point for all eligible voters. Upon navigating to the registration page, the voter is required to provide their full name, eleven-digit National Identification Number, date of birth, state of residence, and email address. The system transmits the NIN to the backend, which hashes it using Keccak256 and queries the simulated NIMC database to confirm eligibility. If the NIN is valid and has not been previously registered, the system proceeds to WebAuthn biometric enrolment.

[Insert Figure 4.2 — Screenshot of the Voter Registration Page.]

Figure 4.2: Voter Registration Interface

The registration interface was designed to be intuitive and accessible to users without technical expertise. Validation messages are displayed in real time to guide the user through any input errors before submission.

4.2.3 WebAuthn Biometric Enrolment

Following successful NIN verification, first-time voters are prompted to enrol their biometric credentials through the WebAuthn API. The browser presents a native prompt requesting the voter to scan their fingerprint or complete a facial recognition scan, depending on the device's available biometric hardware. The WebAuthn protocol generates a cryptographic public and private key pair. The private key remains stored exclusively on the voter's device and is never transmitted to the server. Only the public key is stored in the database, linked to the voter's hashed NIN for future authentication challenges.

[Insert Figure 4.3 — Screenshot of the WebAuthn biometric enrolment prompt.]

Figure 4.3: WebAuthn Biometric Enrolment Prompt

This approach eliminates traditional password-based vulnerabilities such as phishing and credential stuffing, as authentication requires physical possession of the registered device and the voter's biometric.

4.2.4 Voter Authentication Interface

Returning voters authenticate by entering their NIN on the login page. The backend retrieves the associated WebAuthn credential identifier and issues a cryptographic challenge to the browser. The browser then prompts the voter to verify their biometric on the device. If the biometric matches, the device signs the challenge using the stored private key and returns the signed response to the server. The backend verifies the signature against the stored public key. Upon successful verification, a JSON Web Token session is generated, granting the voter access to the ballot.

[Insert Figure 4.4 — Screenshot of the Voter Login page.]

Figure 4.4: Voter Authentication Interface

[Insert Figure 4.5 — Screenshot of the successful authentication confirmation page.]

Figure 4.5: Voter Dashboard After Successful Authentication

4.2.5 Ballot and Vote Casting Interface

Upon successful authentication, the voter is presented with the election ballot displaying all registered candidates with their names, party affiliations, and where applicable, candidate photographs. The voter selects their preferred candidate using a radio button or selection card and clicks the Submit Vote button. The frontend encrypts the vote selection and packages it as a blockchain transaction. The backend calls the VoteRecorder smart contract through Ethers.js, which validates that the voter is registered, has not previously voted, and that the election is currently active before recording the vote immutably on the blockchain ledger.

[Insert Figure 4.6 — Screenshot of the Ballot page.]

Figure 4.6: Election Ballot Interface

4.2.6 Vote Confirmation and Blockchain Receipt

Upon successful vote recording, the smart contract returns a unique transaction hash to the frontend. The system displays a confirmation screen notifying the voter that their vote has been permanently recorded on the blockchain. The transaction hash serves as a cryptographic receipt that the voter can use to independently verify their vote on the blockchain ledger at any time.

[Insert Figure 4.7 — Screenshot of the Vote Confirmation page.]

Figure 4.7: Vote Confirmation Screen with Blockchain Transaction Receipt

4.2.7 Duplicate Vote Rejection

When a voter who has already cast a ballot attempts to vote again, the smart contract's duplicate prevention logic is triggered. The contract checks the hasVoted mapping for the voter's address within the current election. Since the flag is set to true after the first vote, the contract reverts the transaction and returns an error. The frontend displays a clear rejection notification informing the voter that their ballot has already been recorded.

[Insert Figure 4.8 — Screenshot of the rejection notification screen.]

Figure 4.8: Duplicate Vote Rejection Notification

4.2.8 Database Implementation

The system uses PostgreSQL managed through Prisma ORM for off-chain data storage. The database stores information that does not require the overhead of on-chain storage, including voter profiles, election configurations, candidate details, WebAuthn public keys, and authentication logs. Sensitive data such as NIN values and phone numbers are stored exclusively as Keccak256 hashes, ensuring that raw personal information is never persisted in the database.

The key database tables are described below:



Table

Description

voters

Stores voter registration status, hashed NIN, full name, state of residence, WebAuthn credential identifier, and account status

elections

Manages election lifecycle phases including Pending, Active, Closed, and Certified states

candidates

Stores candidate names, party affiliations, display order, and photograph URLs

webauthn_credentials

Stores the public keys associated with each voter's registered device

authentication_logs

Records all login attempts with timestamps, IP addresses, and failure reasons

nin_records

Serves as the simulated NIMC database for NIN validation during registration



[Insert Figure 4.9 — Screenshot of PostgreSQL database showing the voters table.]

Figure 4.9: PostgreSQL Database Implementation Showing Voter Records

4.2.9 Smart Contract Implementation

The core voting logic is implemented in three Solidity smart contracts deployed on the local Hardhat Ethereum node.

VoterRegistry: Maintains a mapping of hashed voter identities to their registration and voting status. It exposes functions to register voters and query whether a given address is registered or has already voted.

ElectionManager: Handles the lifecycle of elections, defining state transitions between Pending, Active, Closed, and Certified phases. Only the authorised election administrator can trigger state changes.

VoteRecorder: Serves as the primary contract responsible for vote recording within the system. It records votes by incrementing candidate vote counts within an election mapping and enforces the rule that each registered voter may cast exactly one vote per election. The following code snippet illustrates the core vote casting logic:

function castVote(uint256 _electionId, uint256 _candidateId) external {

    require(registry.isRegistered(msg.sender), "Not a registered voter");

    require(!hasVoted[_electionId][msg.sender], "Already voted");



    votes[_electionId][_candidateId]++;

    hasVoted[_electionId][msg.sender] = true;



    emit VoteCast(_electionId, _candidateId, msg.sender);

}



[Insert Figure 4.10 — Screenshot of Hardhat terminal showing contract deployment.]

Figure 4.10: Smart Contract Deployment on Local Hardhat Blockchain Node

4.3 Testing

Testing was conducted across multiple layers to ensure that the VoteChain system meets all functional and non-functional requirements specified in Chapter Three. The testing strategy covered smart contract unit testing, backend API validation, end-to-end integration testing of the complete voting workflow, and user acceptance testing with a controlled group of participants.

4.3.1 Smart Contract Unit Testing

Smart contract unit tests were written and executed using the Hardhat testing framework in combination with the Chai assertion library. The tests verified that all critical on-chain functions behave correctly under both valid and invalid conditions. Key scenarios tested included:

Voter registration with a valid NIN hash

Rejection of duplicate registration attempts

Prevention of unregistered voters from casting votes

Successful vote recording by a registered voter

Rejection of double voting attempts

Rejection of votes submitted after an election has closed



[Insert Figure 4.11 — Screenshot of Hardhat terminal showing test results.]

Figure 4.11: Hardhat Smart Contract Unit Test Results

The deterministic nature of smart contracts ensures that identical inputs always produce identical outputs, making automated unit testing a reliable method for validating on-chain logic.

4.3.2 Backend API Testing

Backend API endpoints were tested using Postman to validate request handling, response correctness, and error management. Key endpoints tested included voter registration, NIN verification, WebAuthn challenge generation, vote submission, and result retrieval. Each endpoint was tested with both valid inputs to confirm correct success responses and invalid inputs to confirm appropriate error handling.

[Insert Figure 4.12 — Screenshot of Postman showing a successful API call.]

Figure 4.12: Backend API Testing Using Postman

All tested endpoints returned the expected HTTP status codes and response bodies, confirming that the backend correctly processes requests and communicates with both the database and blockchain layers.

4.3.3 Integration Testing

Integration testing validated the complete end-to-end voting workflow by executing predefined test scenarios with controlled inputs and verifying that all system layers responded correctly in sequence. Table 4.1 presents the integration test cases and their outcomes.

Table 4.1: Integration Test Cases and Results



Test Case

Input

Expected Result

Actual Result

Status

Valid NIN Registration

Valid 11-digit NIN

Voter registered, biometric prompt triggered

Voter registered successfully

Pass

Duplicate NIN Registration

Already registered NIN

Error: Voter already registered

Registration rejected

Pass

Invalid NIN Registration

Unrecognised NIN

Error: NIN not found in NIMC records

NIN rejected by simulated NIMC

Pass

Successful Biometric Enrolment

Valid NIN, biometric scan

WebAuthn public key stored

Public key stored successfully

Pass

Successful Authentication

Registered NIN, correct biometric

JWT session issued, ballot page loaded

Authentication successful

Pass

Failed Authentication

Registered NIN, wrong biometric

Error: Biometric verification failed

Access denied

Pass

Successful Vote Cast

Authenticated voter, valid candidate

Vote recorded, transaction hash returned

Blockchain confirmed transaction

Pass

Duplicate Vote Attempt

Previously voted NIN

Error: Voter has already cast ballot

Smart contract rejected transaction

Pass

Vote After Election Closes

Valid voter, closed election

Error: Election is not active

Transaction reverted by contract

Pass

Result Tallying

Closed election

Correct vote counts displayed

Tallies matched expected counts

Pass



4.3.4 User Acceptance Testing

User acceptance testing was conducted with a controlled group of ten participants who performed a simulated election exercise using the fully integrated system. Participants represented a range of technical literacy levels to assess the system's accessibility and usability across diverse user demographics.

Table 4.2: User Acceptance Testing Results



S/No

Test Scenario

No. of Users

Success

Failure

Success Rate

1

NIN entry and verification

10

10

0

100%

2

WebAuthn biometric enrolment

10

9

1

90%

3

Successful login with biometric

10

9

1

90%

4

Casting a vote and receiving transaction hash

10

10

0

100%

5

Verifying vote using transaction hash

10

8

2

80%

6

Duplicate vote rejection understood

10

10

0

100%



The overall acceptance rate across all test scenarios was 93.3%, indicating strong usability and system reliability. The biometric enrolment step recorded the highest failure rate at 10%, attributed to one participant's device not supporting WebAuthn natively. Vote verification using the transaction hash recorded an 80% success rate, with two participants requiring guidance on how to query the blockchain receipt. Participant feedback was generally positive, with the majority expressing confidence in the system's transparency due to the visible blockchain receipt provided after voting.

4.4 Results Presentation

This section presents the outcomes of the implemented VoteChain system against the objectives stated in Chapter One.

Table 4.3: System Objectives and Results Summary



Objective

Result

Status

Analyse limitations of existing e-voting systems

Key gaps identified including lack of NIN integration, centralised vulnerabilities, and limited auditability

Achieved

Design blockchain-enabled e-voting architecture

Fully documented hybrid architecture with UML diagrams, ERD, and system workflow

Achieved

Integrate NIN for voter authentication

100% NIN verification accuracy achieved in integration testing

Achieved

Implement and conduct functional testing

All 10 integration test cases passed; 93.3% UAT success rate recorded

Achieved

Evaluate system performance against existing solutions

System demonstrated competitive authentication accuracy and vote immutability

Achieved



4.4.1 Authentication Performance

Table 4.4 summarises the authentication performance metrics recorded during testing. The single WebAuthn failure was attributed to device incompatibility rather than a system logic error.

Table 4.4: Authentication Performance Metrics



Metric

Result

NIN Verification Accuracy

100%

WebAuthn Authentication Success Rate

90%

Duplicate Registration Prevention

100%

Unauthorised Access Attempts Blocked

100%

Average Authentication Time

Under 8 seconds



4.4.2 Blockchain Performance

Table 4.5 presents the blockchain performance metrics observed during testing on the local Hardhat Ethereum node.

Table 4.5: Blockchain Performance Metrics



Metric

Result

Vote Recording Success Rate

100%

Duplicate Vote Rejection Rate

100%

Average Transaction Confirmation Time

Under 5 seconds (local Hardhat node)

Smart Contract Test Pass Rate

100% (6/6 unit tests)

Vote Immutability

Verified — no alteration possible post-confirmation

Result Tallying Accuracy

100%



4.4.3 Comparison with Related Works

Table 4.6 compares VoteChain with selected related works reviewed in Chapter Two.

Table 4.6: Comparison of VoteChain with Related Works



Study

Blockchain Platform

NIN Integration

Biometric Auth

Real Deployment

Double Vote Prevention

Bismark et al. (2025)

Ethereum

Simulated

No

Local only

Yes

Njoku et al. (2023)

IBM Hyperledger

Simulated

No

Local only

Yes

Pandey & Tiwari (2023)

Ethereum

No

No

No

Yes

Dumbre et al. (2025)

Permissioned

No

No

No

Yes

Osayomore et al. (2025)

Blockchain + Biometric

No

Fingerprint/Face

No

Yes

VoteChain (This Study)

Ethereum/Hardhat

Simulated

WebAuthn

Local only

Yes



VoteChain distinguishes itself by combining NIN-based identity verification with WebAuthn biometric authentication on an Ethereum-compatible blockchain — a combination not achieved by any single related work reviewed. Whilst real NIMC integration and nationwide deployment remain outside the scope of this study, the system provides a complete proof of concept addressing Nigeria's specific electoral integrity challenges.

4.5 Discussion

Transparency and Immutability

Unlike centralised systems where vote records can be modified by privileged administrators, VoteChain records every vote as an immutable blockchain transaction. Once confirmed by the VoteRecorder smart contract, no party can alter or delete the record. The transaction receipt provided to each voter further enhances transparency by enabling independent verification without compromising ballot secrecy.

Authentication Strength

The combination of NIN verification and WebAuthn biometric authentication provides a stronger authentication layer than the single-factor approaches employed in most related works. Hashing NIN values using Keccak256 and ensuring biometric data never leaves the voter's device protects sensitive personal information whilst maintaining robust identity verification — directly addressing voter impersonation concerns in Nigeria's electoral history.

Hybrid Architecture Benefits

Storing non-critical metadata off-chain in PostgreSQL whilst keeping integrity-critical voting data on-chain reduced transaction costs and improved system responsiveness without compromising immutability. This aligns with Jayakumari et al. (2024), who demonstrated that hybrid blockchain architectures offer superior performance compared to fully on-chain implementations.

Limitations

The system connects to a simulated NIMC database; real-world NIN validation performance may differ

Testing was limited to a local Hardhat node; performance under high concurrent loads on a live network remains untested

One participant's device was incompatible with WebAuthn, highlighting potential accessibility challenges across Nigeria's diverse population

The system currently supports only a single active election, requiring further development before national-scale deployment



Overall Assessment

The VoteChain system demonstrates a viable approach to addressing Nigeria's electoral integrity challenges through blockchain technology. The 100% smart contract test pass rate, 100% duplicate vote rejection rate, and 93.3% UAT success rate confirm that all stated objectives were met. The integration of NIN authentication, WebAuthn biometrics, and Ethereum smart contracts represents a meaningful advancement over existing related implementations and provides a solid foundation for future development.



CHAPTER FIVE

SUMMARY, CONCLUSION AND RECOMMENDATION

5.1 Summary

This study designed and implemented a blockchain-based e-voting system integrated with Nigeria's National Identification Number for secure voter authentication and electoral integrity. The research was motivated by persistent challenges in Nigeria's electoral processes, including technical failures during the 2023 general elections, voter impersonation, ballot manipulation, and the absence of a transparent and auditable voting infrastructure.

Chapter One established the background, problem statement, aim, objectives, and scope of the study. Chapter Two reviewed existing literature on electronic voting, blockchain technology, and biometric authentication, identifying key gaps including the absence of NIN integration, lack of biometric authentication, and unaddressed scalability concerns. Chapter Three presented the system design, including the hybrid architecture, UML diagrams, MoSCoW requirements, and smart contract structures. Chapter Four documented the full implementation and testing of the VoteChain application, covering unit testing, API testing, integration testing, and user acceptance testing.

All five stated objectives were met. The limitations of existing e-voting systems were identified through a comprehensive literature review. A blockchain-enabled hybrid architecture was designed and fully documented. NIN verification with Keccak256 hashing and WebAuthn biometric authentication achieved 100% verification accuracy. All ten integration test cases passed, with a 93.3% user acceptance testing success rate. System performance was evaluated and compared against related works reviewed in Chapter Two.

Challenges encountered included integrating WebAuthn with the backend credential verification process, managing smart contract and frontend interface mismatches, and resolving device compatibility issues during user acceptance testing. These were addressed through iterative debugging and sprint retrospectives.

5.2 Conclusion

This study concludes that blockchain technology, combined with NIN-based identity verification and WebAuthn biometric authentication, provides an effective foundation for addressing Nigeria's electoral integrity challenges. The VoteChain system demonstrated that decentralised ledger technology can eliminate the manipulation vulnerabilities of centralised voting architectures by ensuring that every cast vote is recorded immutably and verifiably.

The hybrid architecture combining off-chain PostgreSQL storage with on-chain smart contract logic proved effective in balancing system performance with the transparency guarantees of blockchain technology. The 100% smart contract test pass rate and 93.3% user acceptance success rate confirm that the system is both technically sound and accessible to users with varying levels of technical literacy.

With further development, live NIMC database integration, and appropriate regulatory frameworks, VoteChain has the potential to significantly enhance the credibility and public trust of democratic elections in Nigeria.

5.3 Recommendations

The following recommendations are made for future development, deployment, and policy consideration:

INEC should pilot blockchain-based e-voting in controlled environments such as local government or student union elections before national deployment.

Future implementations should integrate directly with NIMC's live NIN database through a secured API, replacing the simulated dataset used in this study.

The WebAuthn implementation should include fallback authentication options such as hardware security keys or SMS-based one-time passwords for devices without native biometric support.

The system should be deployed on a public or permissioned network such as Hyperledger Besu or Polygon to evaluate real-world performance under concurrent voter loads.

Zero-knowledge proof cryptographic techniques should be explored to further strengthen ballot secrecy whilst maintaining end-to-end verifiability.

Machine learning-based anomaly detection should be incorporated to identify suspicious voting patterns or coordinated access attempts.

A fully developed election administrator portal with real-time monitoring, audit log management, and result certification workflows should be implemented.

Future user acceptance testing should engage larger, more demographically diverse groups, including elderly voters and participants from rural areas with limited digital literacy.

The smart contract codebase should be subjected to independent third-party security audits using tools such as Slither or Mythril before any real-world deployment.

Policymakers should consider amending Nigeria's Electoral Act to provide regulatory clarity on blockchain-recorded votes, digital authentication, and electronic audit trails.

