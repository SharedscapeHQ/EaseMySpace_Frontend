import React, { useEffect, useState } from "react";
import { getPropertiesWithPayments } from "../../../api/userApi";
import { FiDownload, FiFileText } from "react-icons/fi";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

export default function Agreement() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await getPropertiesWithPayments();
        setProperties(res || []);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        toast.error("Failed to load agreements.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Convert image URL to Base64
  const toBase64 = (url) =>
    fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  const generatePDF = async (property) => {
    const doc = new jsPDF();

    // Add brand logo
    try {
      const logoBase64 = await toBase64("/navbar-assets/brand-logo.png");
      doc.addImage(logoBase64, "PNG", 10, 10, 50, 20);
    } catch (err) {
      console.warn("Logo not loaded:", err);
    }

    doc.setFontSize(18);
    doc.text("Rent Agreement", 105, 40, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Property Name: ${property.property_name}`, 20, 60);
    doc.text(`Address: ${property.address}`, 20, 70);
    doc.text(`Tenant Name: ${property.tenant_name || "N/A"}`, 20, 80);
    doc.text(`Room: ${property.lastPayment?.room_name || "N/A"}`, 20, 90);
    doc.text(`Occupancy: ${property.lastPayment?.occupancy || "N/A"}`, 20, 100);
    doc.text(`Monthly Rent: ₹${property.lastPayment?.amount || "N/A"}`, 20, 110);
    doc.text(`Security Deposit: ₹${property.lastPayment?.deposit || "N/A"}`, 20, 120);
    doc.text(
      `Lease Start Date: ${
        property.lastPayment?.lease_start_date
          ? new Date(property.lastPayment.lease_start_date).toDateString()
          : "N/A"
      }`,
      20,
      130
    );
    doc.text(
      `Lease End Date: ${
        property.lastPayment?.lease_end_date
          ? new Date(property.lastPayment.lease_end_date).toDateString()
          : "N/A"
      }`,
      20,
      140
    );
    doc.text(`Date of Agreement: ${new Date().toDateString()}`, 20, 150);

    doc.setFontSize(10);
    doc.text(
      "This document certifies that the tenant agrees to pay rent for the above property as per the terms and conditions mentioned.",
      20,
      170,
      { maxWidth: 170 }
    );

    doc.save(`${property.property_name}-Agreement.pdf`);
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading agreements...</p>;

  if (!properties.length)
    return <p className="text-center text-gray-500 mt-10">No agreements found.</p>;

  return (
    <div className=" space-y-6">
      
      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property.property_id}
            className="border rounded-2xl p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{property.property_name}</p>
              <p className="text-gray-600 text-sm">{property.address}</p>
              <p className="text-gray-600 text-sm">
                Tenant: {property.tenant_name || "N/A"}
              </p>
              <p className="text-gray-600 text-sm">
                Lease:{" "}
                {property.lastPayment?.lease_start_date
                  ? new Date(property.lastPayment.lease_start_date).toLocaleDateString()
                  : "N/A"}{" "}
                -{" "}
                {property.lastPayment?.lease_end_date
                  ? new Date(property.lastPayment.lease_end_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <button
              onClick={() => generatePDF(property)}
              className="mt-3 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FiDownload /> Download Agreement
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
