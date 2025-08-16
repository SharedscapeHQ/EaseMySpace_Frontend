import React from 'react';
import Footer from '../Footer';

const CancellationRefundPolicy = () => {
  return (
    <section className="bg-white py-10  h-screen">
      <div className="max-w-4xl mx-auto bg-zinc-200 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Cancellation & Refund Policy
        </h2>
        <p className="text-gray-700 mb-4">
          At <strong>EaseMySpace</strong>, we strive to provide a transparent and seamless experience. Please note:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>
            All payments made on{' '}
            <a
              href="https://easemyspace.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              EaseMySpace.in
            </a>{' '}
            are final and non-refundable.
          </li>
          <li>
            Once a listing is submitted and payment is processed, no cancellation or refund request will be entertained under any circumstances.
          </li>
          <li>
            We encourage users to carefully review their listings and details before confirming payment.
          </li>
        </ul>
        <p className="text-gray-700 mb-2">
          For any queries or concerns, you can reach out to us at{' '}
          <a
            href="mailto:support@easemyspace.in"
            className="text-blue-600 hover:underline"
          >
            support@easemyspace.in
          </a>.
        </p>
        <p className="text-gray-700">
          By making a payment on our platform, you agree to this policy.
        </p>
      </div>
      <Footer/>
    </section>
  );
};

export default CancellationRefundPolicy;
