# Defense Preparation: Mobile Phone Usage for WebAuthn

**Question:** *"If this was a live, real-world application, how would voters using mobile phones authenticate since they don't have Windows Hello?"*

**Clean, Straightforward Answer:**

If a voter accesses the system using a smartphone, the system works exactly the same way without requiring them to download any app. This is because **WebAuthn is a universal web standard (W3C)** supported by all modern mobile browsers (Safari on iPhone, Chrome on Android).

Here is exactly what happens on a mobile phone:

1. **Native Hardware Integration:** Instead of triggering "Windows Hello," the browser automatically triggers the phone's built-in native biometric hardware. 
2. **For iPhone Users:** When the voter clicks "Register" or "Login," Safari will natively prompt them to use **Face ID** or **Touch ID**. 
3. **For Android Users:** Chrome will natively prompt them to use their **Fingerprint Scanner** or **Face Unlock**.
4. **Secure Enclave:** Just like on a laptop, the private cryptographic key is generated and stored securely in the phone's hardware (Apple Keychain or Google Password Manager), ensuring it cannot be intercepted or stolen.

**Key Takeaway for the Panel:** 
You can tell the panel: *"Because the system is built on the WebAuthn standard, it is completely device-agnostic. It seamlessly bridges web technologies with native device hardware, allowing iOS users to use Face ID and Android users to use their fingerprint scanners directly through their web browser."*
