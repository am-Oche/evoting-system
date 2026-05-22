# Supervisor Questions & Defense Guide

This document contains structured answers to defend your project choices and explain the technical implementation of your e-voting system to your supervisor.

---

## 1. Should I have an appendix?
**Yes, an appendix is highly recommended** for a software development final year project. It is used for important supporting materials that are too detailed for the main chapters, such as:
*   **Source Code Snippets:** Key parts of your system, such as your Blockchain Smart Contracts (`VoteChain.sol`) or the NIN authentication endpoint.
*   **System Screenshots:** Extra screenshots of your User Interface (Admin Portal, Voter Dashboard, WebAuthn prompts, Metamask transactions) that couldn't fit in Chapter 4.
*   **User Manual/Run Guide:** Step-by-step instructions on how to set up, deploy, and use the system.
*   **Evaluation Tools:** If you used any surveys, questionnaires, or raw data tables for your user acceptance testing.

---

## 2. How the NIN and Biometrics link together (Briefly)
Here is a brief explanation you can provide:

> "In this system, the **National Identification Number (NIN)** serves as the primary unique identifier, verifying the voter's demographic data and eligibility status against the database. The **Biometric component** acts as the cryptographic authenticator. When a voter inputs their NIN, the system utilizes WebAuthn to trigger a biometric challenge on the user's device. The biometric scan proves that the physical person attempting to access the system is the authorized owner of the device, effectively linking the digital NIN identity to the physical user and preventing impersonation."

---

## 3. Can facial detection be added since it's part of WebAuthn?
**Yes, absolutely! And it is already implemented.** 
Because you built the authentication system using the **WebAuthn** standard (Passkeys), you do not need to write any custom AI code for facial detection. WebAuthn handles this automatically by delegating to the device's "Platform Authenticator."

*   If a voter uses a device equipped with facial recognition (e.g., Apple Face ID, Windows Hello Face Recognition, or Android Face Unlock), WebAuthn automatically prompts them to use their face to authenticate. 
*   It is highly secure because the facial data never leaves the user's device; WebAuthn only sends a secure cryptographic proof to your backend that the facial check was successful.

---

## 4. How is a specific Biometric (Face) locked to a specific NIN?
Since you don't have access to the government's central face database, your system uses **Device Hardware Locking** to ensure that once a face is registered, no other face can ever be used for that NIN.

**Step-by-Step Defense:**
1. **The Initial Registration:** When the true owner of the NIN registers for the first time, their device asks them to scan their face.
2. **Key Generation:** Deep inside a highly secure chip on the phone (the Secure Enclave), the phone uses that specific face to generate a mathematically unique **Private Key** and **Public Key**.
3. **The Database Lock:** The phone sends the **Public Key** to your backend. Your backend saves it in the database right next to the NIN (e.g., `[NIN: 12345678901] <--> [Public Key: XyZ123]`). From this moment, the account is permanently locked to that specific Public Key.
4. **Why another face fails:** If a hacker steals the NIN and uses their own computer, their computer lacks the Private Key. If a friend borrows the correct phone and tries to vote, the phone will reject their face and refuse to unlock the Private Key.

**Summary for Supervisor:**
> *"The specific biometric is cryptographically locked to the NIN through a hardware-backed Private Key. During registration, the user's specific face is used by the device's Secure Enclave to generate a unique Public/Private key pair. The Public Key is permanently saved in our database alongside the NIN. From that moment on, the only way to cast a vote is to provide the exact same physical face to unlock the exact same Private Key on that specific device."*

*(Note: To guarantee the person registering the NIN is the true owner in the real world, the system would use an SMS OTP sent to the NIN's registered phone number before allowing the WebAuthn registration).*

---

## 5. How the Document/Code Achieves the Aims, Objectives, and Chapter 3
If your supervisor asks, *"Show me where the project actually does what Chapter 3 says,"* here is your defense:

### Aims & Objectives
*   **Objective 1 (Analyze Limitations):** Addressed in Chapter 1 & 2 by highlighting BVAS failures (14% failure rate in 2023) and centralization flaws. The code solves this by decentralizing vote storage.
*   **Objective 2 (Blockchain Immutability):** Achieved through **Solidity Smart Contracts** (Hardhat/Ethereum). Once a vote is cast via the React frontend, it is mined on the blockchain and permanently frozen (immutable).
*   **Objective 3 (NIN Integration):** Achieved via your `ninRecord` database table (seeded via Prisma). Before WebAuthn executes, the Node.js backend actively queries the PostgreSQL database to ensure the NIN is a real, registered citizen.
*   **Objective 4 & 5 (Testing & Evaluation):** Achieved by following the Mixed-Methods Approach (evaluating both transaction speeds and user acceptance).

### Chapter 3 Diagrams & Methodology
*   **System Architecture Diagram:** The theoretical 3-tier architecture in Chapter 3 maps perfectly to your codebase:
    *   *Client Layer:* React (Vite)
    *   *Application Layer:* Node.js/Express
    *   *Data Layer:* PostgreSQL (Prisma) + Hardhat (Blockchain)
*   **Flowchart Diagrams:** Your code strictly follows the logical flowchart: Input NIN $\rightarrow$ Verify in DB $\rightarrow$ Trigger WebAuthn Biometric $\rightarrow$ Cast Smart Contract Vote $\rightarrow$ Return Transaction Hash.
*   **Software Methodology:** You correctly utilized **Agile (Scrum)**. This is the perfect methodology for blockchain projects because smart contracts are permanent and require iterative testing and security validation before final deployment.
