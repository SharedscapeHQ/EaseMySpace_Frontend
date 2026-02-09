import React from 'react';
import Footer from '../Footer';

const CancellationRefundPolicy = () => {
  return (
    <section className="bg-gradient-to-b from-white to-zinc-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-zinc-200">
        <h2 style={{ fontFamily: "para_font" }} className="text-3xl sm:text-4xl  text-center text-zinc-800 mb-8">
          Cancellation & Refund Policy
        </h2>

        <p className="text-zinc-700 leading-relaxed mb-5 text-center">
          At <strong>EaseMySpace</strong>, we strive to provide a transparent and seamless experience. Please note:
        </p>

        <ul className="list-disc pl-6 space-y-4 text-zinc-700 mb-6">
          <li>
            All payments made on{" "}
            <a
              href="https://easemyspace.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              EaseMySpace.in
            </a>{" "}
            are final and non-refundable.
          </li>
          <li>
            Once a listing is submitted and payment is processed, no cancellation or refund request will be entertained under any circumstances.
          </li>
          <li>
            We encourage users to carefully review their listings and details before confirming payment.
          </li>
        </ul>

        <p className="text-zinc-700 mb-3 text-center">
          For any queries or concerns, you can reach out to us at{" "}
          <a
            href="mailto:support@easemyspace.in"
            className="text-blue-600 font-medium hover:underline"
          >
            support@easemyspace.in
          </a>.
        </p>

        <p className="text-zinc-700 text-center font-medium">
          By making a payment on our platform, you agree to this policy.
        </p>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </section>
  );
};


export default CancellationRefundPolicy;
