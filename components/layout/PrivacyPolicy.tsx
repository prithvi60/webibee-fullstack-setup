import React from "react";

const PrivacyPolicy = () => {
    return (
        <section className="max-w-3xl mx-auto p-6 prose text-black">
            <h1>Privacy Policy</h1>
            <p><strong>Effective Date:</strong> July 14, 2025</p>

            <p>This Privacy Policy explains how we collect, use, and protect your information when you use our application or website (&quot;the Service&quot;).</p>

            <h2>1. Information We Collect</h2>
            <ul>
                <li>Your name</li>
                <li>Your email address</li>
                <li>Your profile picture</li>
                <li>Your Google account ID (used internally)</li>
            </ul>
            <p>We do <strong>not</strong> access your Gmail, Calendar, or any other sensitive data.</p>

            <h2>2. How We Use Your Information</h2>
            <ul>
                <li>To authenticate your identity via Google OAuth</li>
                <li>To personalize your experience within the app</li>
                <li>To ensure secure and seamless login</li>
            </ul>

            <h2>3. Data Storage & Sharing</h2>
            <p>We do <strong>not</strong> sell, trade, or share your personal information with any third parties. Your data is stored securely and is only used for login and account-related features within our app.</p>

            <h2>4. Google OAuth</h2>
            <p>Our application uses Google OAuth to verify your identity. This allows you to log in using your Google account securely. We adhere to Google&apos;s API Services User Data Policy and will not use your information for any other purpose.</p>
            <p>
                You can read Google’s full policy here:{" "}
                <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    className="text-blue-600 underline"
                    target="_blank"
                >
                    Google API Services User Data Policy
                </a>
            </p>

            <h2>5. Your Control</h2>
            <p>You may revoke our access to your data at any time from your Google Account settings here:</p>
            <p>
                <a
                    href="https://myaccount.google.com/permissions"
                    className="text-blue-600 underline"
                    target="_blank"
                >
                    https://myaccount.google.com/permissions
                </a>
            </p>

            <h2>6. Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us at:{" "}
                <a href="prithvi@webibee.com" className="text-blue-600 underline">
                    prithvi@webibee.com
                </a>
            </p>
        </section>
        // <div className="w-full h-full padding space-y-7 md:space-y-14">
        //     <h1
        //         className={`font-extrabold leading-8 font-plus md:leading-10 tracking-wide text-center text-black text-[clamp(1.2rem,3vw,3rem)]`}
        //     >
        //         Webibee Privacy Policy
        //     </h1>
        //     <p className="text-[clamp(1rem,1.15vw,1.5rem)] leading-7 font-normal text-foreground">
        //         When you utilize our services or willingly provide us with your
        //         information, you are consenting to the terms outlined in this Privacy
        //         Policy. We deeply respect your privacy and are committed to safeguarding
        //         it. This Privacy Policy, governed by the Information Technology Act,
        //         2000 (as amended) and Information Technology (Reasonable Security
        //         Practices and Procedures and Sensitive Personal Data or Information)
        //         Rules, 2011, elucidates how Aspire Tech Educational Private Limited
        //         (&#34;Aspire Tech Academy&#34;) collects, utilizes, shares, and
        //         processes your personal information. We strongly recommend that you
        //         thoroughly review this Privacy Policy before divulging any personal
        //         data. Please note that this Privacy Policy pertains to Aspire Tech
        //         Academy&#39;s website, applications, social media, email, and chat
        //         services (&#34;Site&#34;).
        //     </p>
        //     <p className="text-[clamp(1rem,1.15vw,1.5rem)] leading-7 font-normal text-foreground">
        //         Rest assured, we only gather personal information when you willingly
        //         provide it to us, particularly during the registration process for
        //         certain services offered to students and participants on our website. Be
        //         assured that we do not disclose, share, sell, or transfer personal
        //         information to any unrelated third parties. While no system can
        //         guarantee absolute security, it&#39;s important to note that we make
        //         rigorous efforts to protect your data to the best of our ability, even
        //         though we do not claim to be fully compliant with the General Data
        //         Protection Regulation (GDPR) (EU) 2016/679. Your privacy remains a top
        //         priority for us.
        //     </p>
        // </div>
    );
};

export default PrivacyPolicy;
