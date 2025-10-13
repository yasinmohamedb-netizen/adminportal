// PrivacyPolicyPage.js
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", lineHeight: "1.6" }}>
      <h1>HealthYz Privacy Policy</h1>
      <p>Last updated: October 2025</p>
      <p>Contact: <a href="mailto:zayzhealthcare@gmail.com">zayzhealthcare@gmail.com</a></p>

      <p>
        Your privacy is important to us. This Privacy Policy explains how HealthYz (“we”, “our”, or “us”) collects, uses, and protects your information when you use our mobile app and services. By using HealthYz, you agree to the practices described below.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, profile details, payment details (processed securely via third-party gateways).</li>
        <li><strong>Health & Service Data:</strong> Doctor consultation records, homecare bookings, wellness service history, trainer sessions, product orders.</li>
        <li><strong>Device & Usage Data:</strong> Device type, OS version, app version, usage statistics and analytics via Firebase Analytics, Advertising ID (if applicable for analytics only).</li>
        <li><strong>Location Data (Optional):</strong> Approximate location if you enable location services for nearby clinics or service providers.</li>
        <li><strong>Other Information:</strong> Any data you voluntarily provide via feedback, surveys, or support requests.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide and improve our services</li>
        <li>Process bookings, consultations, and purchases</li>
        <li>Send notifications or updates about your account and services</li>
        <li>Conduct analytics to improve app performance and user experience</li>
        <li>Ensure security and prevent fraud</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>We do not sell your personal information. We may share your information with:</p>
      <ul>
        <li>Trusted third-party service providers (e.g., Firebase, Twilio, payment gateways) to provide services</li>
        <li>Legal authorities if required by law or to prevent fraud or security breaches</li>
      </ul>

      <h2>4. Advertising & Analytics</h2>
      <ul>
        <li>We use Firebase Analytics to collect anonymized usage data to improve app performance and features.</li>
        <li>If any SDKs use Advertising ID, it is solely for app performance measurement and not for personalized ads.</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>We implement encryption, secure servers, and access controls to protect your data. Only authorized personnel have access to personal information required to provide services.</p>

      <h2>6. User Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Request updates or corrections</li>
        <li>Request deletion of your data</li>
        <li>Opt-out of analytics tracking where applicable</li>
      </ul>
      <p>To exercise your rights, contact us at <a href="mailto:zayzhealthcare@gmail.com">zayzhealthcare@gmail.com</a></p>

      <h2>7. Data Retention</h2>
      <p>
        Personal and health data is retained as long as your account is active or as needed to provide services. After account deletion or service termination, your data will be securely deleted within a reasonable timeframe.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        HealthYz is intended for users <strong>18 years and older</strong>. We do not knowingly collect personal information from children under 18.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last Updated” date will reflect the latest version. Please review this policy periodically.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For any questions about this Privacy Policy or your data, contact us at <a href="mailto:zayzhealthcare@gmail.com">zayzhealthcare@gmail.com</a>.
      </p>
    </div>
  );
}
