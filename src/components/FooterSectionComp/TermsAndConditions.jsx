import React from 'react';
import Footer from '../Footer';

const TermsAndConditions = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-zinc-200">
        <h2 style={{ fontFamily: "para_font" }} className="text-3xl sm:text-4xl font-bold text-center text-zinc-800 mb-10">
          Terms and Conditions
        </h2>

        <div className="space-y-8 text-zinc-700 leading-relaxed">
          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">1. Definitions</h3>
            <p>
              <strong>"EaseMySpace," "we," "our," "us"</strong> – refers to EaseMySpace.in, a brand managed by Triptastic Travel Ventures Private Limited.
              <br />
              <strong>"User," "you," "your"</strong> – refers to any individual or entity accessing or using our platform.
              <br />
              <strong>"Services"</strong> – refers to all features and functionalities provided through EaseMySpace, including flatmate-finding and related urban living solutions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">2. Eligibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old.</li>
              <li>Provide accurate and complete information during registration.</li>
              <li>Agree to comply with these Terms and applicable laws.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">3. User Accounts</h3>
            <p>
              You must register an account to access certain services. You are responsible for maintaining the confidentiality of your login credentials. We reserve the right to suspend or terminate accounts that violate our policies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">4. Services and Listings</h3>
            <p>
              Users can create listings for available rental spaces and search for flatmates. Listings must be accurate, lawful, and not misleading. We do not guarantee the accuracy or reliability of user-generated content.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">5. Payments and Fees</h3>
            <p>
              Certain services may be subject to fees, which will be disclosed upfront. Payments must be made through authorized channels. We do not assume responsibility for transactions conducted outside our platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">6. Prohibited Activities</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post false, misleading, or offensive content.</li>
              <li>Engage in fraud, harassment, or unlawful activities.</li>
              <li>Use automated scripts to collect information or interfere with the platform.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">7. Intellectual Property</h3>
            <p>
              All content, trademarks, and designs on EaseMySpace are owned by us or licensed for use. You may not copy, modify, or distribute content without authorization.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">8. Privacy Policy</h3>
            <p>
              Your use of EaseMySpace is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">9. Limitation of Liability</h3>
            <p>
              EaseMySpace is a platform that connects users and does not endorse or verify listings. We are not responsible for any disputes, damages, or losses arising from interactions on our platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">10. Termination</h3>
            <p>
              We reserve the right to terminate or restrict your access if you violate these Terms or engage in unlawful activities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">11. Governing Law</h3>
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be resolved in the courts of Mumbai, Maharashtra.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">12. Changes to These Terms</h3>
            <p>
              We may update these Terms from time to time. Continued use of our platform constitutes acceptance of any revised Terms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-zinc-800 mb-2">13. Contact Us</h3>
            <p>
              If you have any questions or concerns about these Terms, please contact us at{" "}
              <a
                href="mailto:support@easemyspace.in"
                className="text-blue-600 font-medium hover:underline"
              >
                support@easemyspace.in
              </a>.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </section>
  );
};


export default TermsAndConditions;
