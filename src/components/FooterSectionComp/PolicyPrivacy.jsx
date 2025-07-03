import React from 'react';
import Footer from '../Footer';

const PrivacyPolicy = () => {
  return (
    <section className="bg-white pt-10">
      <div className="max-w-4xl mx-auto bg-zinc-200 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Privacy Policy
        </h2>
        <p className="text-sm text-gray-500 mb-6">Last updated: March 2025</p>

        <div className="space-y-6 text-gray-700">
          <p>
            Welcome to <strong>EaseMySpace</strong>! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
          </p>

          <div>
            <h3 className="font-semibold text-lg mb-2">1. Information We Collect</h3>
            <p>
              We collect personal details such as name, email, phone number, and location when you register or use our services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">2. How We Use Your Information</h3>
            <p>
              We use your data to provide, personalize, and improve our services, including connecting users with potential flatmates.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">3. Data Protection</h3>
            <p>
              We take security seriously and implement safeguards to protect your data from unauthorized access or misuse.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">4. Third-Party Services</h3>
            <p>
              We may use third-party services like payment processors, analytics tools, and social logins, which have their own privacy policies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">5. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, contact us at{' '}
              <a
                href="mailto:hello@easemyspace.in"
                className="text-blue-600 hover:underline"
              >
                hello@easemyspace.in
              </a>.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </section>
  );
};

export default PrivacyPolicy;
