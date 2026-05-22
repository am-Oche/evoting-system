# 📝 Pending Features & Development To-Do List

This document serves as a persistent reminder for the features and fixes we need to implement next in the VoteChain system after the documentation is finalized.

---

### 1. 🔒 WebAuthn Biometric Implementation
- **Task:** Fully integrate and finalize the actual WebAuthn biometric enrollment and authentication flow.
- **Details:** Ensure that the frontend correctly interfaces with the backend to store public keys, and successfully prompts the user's native hardware (Windows Hello / Face ID / Touch ID) during login and voting.

### 2. 📰 Voter Dashboard "News" Tab
- **Task:** Add a "News" tab to the Voter Portal.
- **Details:** Voters should be able to read updates, election announcements, and general information before and after they cast their vote.

### 3. 👤 Voter Profile & Picture Upload
- **Task:** Create a Profile section for the voter.
- **Details:** Allow voters to view their details and upload a profile picture. This requires updating the backend to handle image uploads (e.g., using Multer) and saving the image URL to the PostgreSQL database.

### 4. ✅ Post-Voting Access (Read-Only Dashboard)
- **Task:** Modify the login flow so that users who have *already voted* can still log into the system successfully.
- **Details:** 
  - If a user has already voted, they should **not** be blocked from logging in.
  - Instead, they should be redirected to their dashboard where the voting ballot is disabled/hidden.
  - They should still have full access to the **News** tab, their **Profile**, and their **Voting Receipt**.

---

## 🌟 Awesome New Suggestions (To Make the Project Stand Out)

### 5. 📥 Downloadable PDF Voting Receipt
- **Task:** Add a "Download PDF" button to the voting receipt page.
- **Details:** Generate a formal PDF receipt containing the transaction hash, timestamp, and a scannable **QR Code** that links directly to the blockchain explorer. This is a massive flex for a defense presentation.

### 6. 📊 Live Election Countdown & Results Tracker (Voter Side)
- **Task:** Show real-time statistics to the voter.
- **Details:** Add a countdown timer showing when the election ends. Once the election closes, automatically switch the dashboard to show a beautiful chart (like a pie chart or bar graph) of the final, transparent election results.

### 7. 🌍 Multi-Language Toggle (Accessibility)
- **Task:** Add a language dropdown at the top of the screen.
- **Details:** Since it's a Nigerian system, having a toggle that switches the UI text between English, Pidgin, Hausa, Yoruba, and Igbo would show incredible attention to real-world user accessibility.

### 8. 📩 SMS or Email Notifications
- **Task:** Notify the voter after a successful action.
- **Details:** Integrate a basic email service (like Nodemailer) or SMS API to send the user a message: *"Your vote for the 2026 Presidential Election has been securely recorded on the blockchain."* 

### 9. 🛡️ Admin Audit Logs & Security Alerts
- **Task:** Add a security dashboard for the Admin.
- **Details:** Track failed login attempts or people trying to use fake NINs. If someone tries to vote twice, log it as a "Security Event" that the admin can review. This proves the system actively detects and stops fraud.

### 10. 🌗 Dark Mode / Light Mode
- **Task:** Add a theme toggle switch.
- **Details:** An aesthetic upgrade that lets voters switch between a sleek dark theme and a clean light theme. It makes the application feel incredibly premium and modern.
