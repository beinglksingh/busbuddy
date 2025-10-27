import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="terms-updated">Last Updated: January 2025</p>

        <div className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to BusBuddy! These Terms and Conditions (&quot;Terms&quot;) govern your use of the BusBuddy website,
            mobile applications, and services (collectively, the &quot;Platform&quot;). By accessing or using our Platform,
            you agree to be bound by these Terms. If you do not agree with these Terms, please do not use our services.
          </p>
          <p>
            BusBuddy is an online bus ticket booking platform that connects customers with bus operators across
            multiple routes. We facilitate the booking process but do not operate the buses ourselves.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. User Account</h2>
          <p>
            To book tickets through BusBuddy, you must create an account by providing accurate and complete information.
            You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Ensuring your contact information is current and accurate</li>
          </ul>
          <p>
            You must be at least 18 years old to create an account and make bookings on BusBuddy.
          </p>
        </div>

        <div className="terms-section">
          <h2>3. Booking and Payment</h2>
          <h3>3.1 Ticket Booking</h3>
          <p>
            When you book a ticket through BusBuddy, you enter into a contract directly with the bus operator.
            BusBuddy acts as an intermediary to facilitate this transaction.
          </p>
          
          <h3>3.2 Pricing</h3>
          <p>
            All prices displayed on the Platform are in Indian Rupees (INR) unless otherwise specified. Prices
            include applicable taxes and service charges. We reserve the right to change prices at any time,
            but price changes will not affect bookings already confirmed.
          </p>

          <h3>3.3 Payment Methods</h3>
          <p>
            We accept various payment methods including credit/debit cards, net banking, UPI, and digital wallets.
            All payments are processed through secure payment gateways. You agree to provide valid payment information
            and authorize us to charge the specified amount.
          </p>

          <h3>3.4 Booking Confirmation</h3>
          <p>
            Upon successful payment, you will receive a booking confirmation via email and SMS. This confirmation
            includes your ticket details, booking reference number, and boarding information. Please verify all
            details immediately upon receipt.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. Cancellation and Refund Policy</h2>
          <h3>4.1 Cancellation</h3>
          <p>
            Cancellation terms vary depending on the bus operator and route. Generally:
          </p>
          <ul>
            <li>Cancellations made more than 24 hours before departure: 75-90% refund</li>
            <li>Cancellations made 12-24 hours before departure: 50-75% refund</li>
            <li>Cancellations made less than 12 hours before departure: 25-50% refund</li>
            <li>No refund for no-shows or cancellations after departure</li>
          </ul>
          <p>
            Specific cancellation policies for your booking will be displayed during the booking process and in
            your confirmation email.
          </p>

          <h3>4.2 Refund Processing</h3>
          <p>
            Approved refunds will be processed to the original payment method within 7-14 business days. Service
            charges and payment gateway fees are non-refundable. In case of bus operator cancellations, you will
            receive a full refund.
          </p>
        </div>

        <div className="terms-section">
          <h2>5. Travel Guidelines</h2>
          <h3>5.1 Passenger Responsibilities</h3>
          <p>
            As a passenger, you must:
          </p>
          <ul>
            <li>Arrive at the boarding point at least 15 minutes before departure</li>
            <li>Carry a valid government-issued ID proof and your ticket (printed or digital)</li>
           <li>Follow the bus operator&#39;s rules and regulations</li>
            <li>Respect fellow passengers and bus staff</li>
            <li>Not carry prohibited items or excessive luggage</li>
          </ul>

          <h3>5.2 Luggage Policy</h3>
          <p>
            Each passenger is typically allowed one check-in bag (up to 15 kg) and one hand bag. Additional or
            overweight luggage may incur extra charges. Prohibited items include flammable materials, weapons,
            and illegal substances.
          </p>

          <h3>5.3 Special Requirements</h3>
          <p>
            If you have special requirements such as wheelchair accessibility or traveling with pets, please
            contact us in advance to check availability and make necessary arrangements.
          </p>
        </div>

        <div className="terms-section">
          <h2>6. Modifications and Rescheduling</h2>
          <p>
            Ticket modifications and rescheduling are subject to availability and bus operator policies. Changes
            may incur additional charges. Some tickets are non-transferable and cannot be rescheduled. Please
            check your specific ticket terms before attempting modifications.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Service Disruptions</h2>
          <p>
            While we strive to provide reliable service, disruptions may occur due to:
          </p>
          <ul>
            <li>Technical issues or maintenance</li>
            <li>Weather conditions or natural disasters</li>
            <li>Bus operator delays or cancellations</li>
            <li>Government regulations or restrictions</li>
          </ul>
          <p>
            BusBuddy is not liable for losses arising from such disruptions. We will make reasonable efforts to
            notify you of any significant changes affecting your booking.
          </p>
        </div>

        <div className="terms-section">
          <h2>8. Limitation of Liability</h2>
          <p>
            BusBuddy acts as an intermediary between customers and bus operators. We are not responsible for:
          </p>
          <ul>
            <li>The quality, safety, or timeliness of bus services</li>
            <li>Loss, damage, or delay of luggage</li>
            <li>Personal injury or accidents during travel</li>
            <li>Actions or omissions of bus operators or their staff</li>
            <li>Force majeure events beyond our control</li>
          </ul>
          <p>
            Our total liability for any claim related to our services is limited to the amount paid for the
            specific booking in question.
          </p>
        </div>

        <div className="terms-section">
          <h2>9. Privacy and Data Protection</h2>
          <p>
            We collect and process your personal information in accordance with our Privacy Policy. By using
            BusBuddy, you consent to our collection, use, and sharing of your information as described in the
            Privacy Policy. We implement appropriate security measures to protect your data.
          </p>
        </div>

        <div className="terms-section">
          <h2>10. Intellectual Property</h2>
          <p>
            All content on the BusBuddy Platform, including text, graphics, logos, images, and software, is the
            property of BusBuddy or its licensors and is protected by intellectual property laws. You may not
            reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </div>

        <div className="terms-section">
          <h2>11. Prohibited Activities</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the Platform for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with the proper functioning of the Platform</li>
            <li>Use automated tools to access or scrape our content</li>
            <li>Impersonate others or provide false information</li>
            <li>Engage in fraudulent transactions or money laundering</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>12. Dispute Resolution</h2>
          <p>
            Any disputes arising from these Terms or your use of BusBuddy shall be resolved through:
          </p>
          <ul>
            <li>First, by contacting our customer support team</li>
            <li>If unresolved, through mediation or arbitration</li>
            <li>As a last resort, through the courts of [Your Jurisdiction]</li>
          </ul>
          <p>
            These Terms are governed by the laws of India, and you agree to submit to the jurisdiction of
            Indian courts.
          </p>
        </div>

        <div className="terms-section">
          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
            posting on the Platform. Your continued use of BusBuddy after changes are posted constitutes your
            acceptance of the revised Terms. We recommend reviewing these Terms periodically.
          </p>
        </div>

        <div className="terms-section">
          <h2>14. Contact Information</h2>
          <p>
            If you have questions about these Terms or need assistance, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>BusBuddy Customer Support</strong></p>
            <p>Email: support@busbuddy.com</p>
            <p>Phone: 1800-XXX-XXXX (Toll Free)</p>
            <p>Hours: 24/7 Customer Support</p>
          </div>
        </div>

        <div className="terms-section">
          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
            will continue in full force and effect. The invalid provision will be replaced with a valid provision
            that most closely matches the intent of the original.
          </p>
        </div>

        <div className="terms-footer">
          <p>
            By using BusBuddy, you acknowledge that you have read, understood, and agree to be bound by these
            Terms and Conditions.
          </p>
          <p className="terms-effective">
            These Terms and Conditions are effective as of January 1, 2025.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
