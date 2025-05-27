// src/pages/PrivacyPolicyPage.js
import React from 'react';
import { Container, Typography } from '@mui/material';

function PrivacyPolicyPage() {
  return (
    <Container sx={{ mt: 4, mb: 4, pb: 10 }}>
      <Typography variant="h3" gutterBottom>
        Privacy Policy
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Effective Date:</strong> May 11, 2025
      </Typography>

      <Typography variant="body1" paragraph>
        At NK‑Organics, we value your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or purchase our natural remedy products, including assorted spices, herbs, essential oils, and more. We are committed to ensuring that your personal information remains secure while you enjoy a seamless shopping experience.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>1. Information We Collect</strong>: We collect information that you voluntarily provide when you register on our site, place an order, subscribe to our newsletter, or contact us. Such information may include your name, email address, mailing address, phone number, payment details, and any other details you choose to share. Additionally, we automatically collect technical data such as your IP address, browser type, device information, and usage data via cookies and other tracking technologies.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>2. How We Use Your Information</strong>: The personal information we collect is used for:
      </Typography>

      <Typography variant="body1" component="ul">
        <li>Processing and fulfilling your orders and managing transactions.</li>
        <li>Improving and personalizing your experience on our website.</li>
        <li>Sending you periodic updates, promotional emails, and important notices.</li>
        <li>Responding to your inquiries and providing effective customer service.</li>
        <li>Ensuring the security and efficient operation of our website.</li>
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>3. Information Sharing and Disclosure</strong>: We do not sell or trade your personal information. We may share information with trusted third-party service providers who assist us with business operations (such as payment processing, order fulfillment, and website analytics) under strict confidentiality agreements. We may also disclose your data if required by law or to protect our rights.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>4. Data Protection and Security</strong>: We implement various security measures, including encryption and secure servers, to protect your personal information from unauthorized access and misuse. While we strive to secure your data, no method of transmission over the internet or electronic storage is completely foolproof, and we cannot guarantee absolute security.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>5. Cookies and Tracking Technologies</strong>: Our website uses cookies and similar technologies to enhance your browsing experience, analyze trends, and gather demographic information. You can modify your browser settings to refuse cookies; however, this may affect the functionality of certain features on our site.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>6. Your Rights</strong>: You have the right to access, update, or request the deletion of your personal information. Should you wish to exercise any of these rights, please contact us at the email address listed below.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>7. Changes to This Privacy Policy</strong>: We reserve the right to modify this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>8. Contact Information</strong>: If you have any questions, concerns, or requests related to this Privacy Policy or our data practices, please contact us at:
        <br />
        Email: support@nk-organics.com
        <br />
        Address: Kasarani, Nairobi, Kenya
      </Typography>

      <Typography variant="body1" paragraph>
        By using our website and services, you acknowledge that you have read and understood this Privacy Policy, and you agree to its terms.
      </Typography>
    </Container>
  );
}

export default PrivacyPolicyPage;