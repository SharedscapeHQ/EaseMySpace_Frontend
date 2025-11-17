import React, { useEffect, useState } from "react";
import { getAllLandlordsLedgerSummary } from "../../api/adminApi"; // ✅ adjust path if needed
import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi";

export default function LandlordLedgerSummary() {
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllLandlordsLedgerSummary();
        setLedgerData(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching landlord ledger summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Export to Excel
  const exportToExcel = () => {
    if (ledgerData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(ledgerData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LedgerSummary");

    XLSX.writeFile(workbook, "Landlords_Ledger_Summary.xlsx");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Landlords & Agents Ledger Summary
        </h2>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FiDownload /> Export Excel
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading...</p>
      ) : ledgerData.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border text-left">Landlord / Agent</th>
                <th className="px-4 py-2 border text-left">Email</th>
                <th className="px-4 py-2 border text-center">Properties</th>
                <th className="px-4 py-2 border text-right">Total Rent Received</th>
                <th className="px-4 py-2 border text-right">Service Charge (10%)</th>
                <th className="px-4 py-2 border text-right">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.map((item, index) => (
                <tr key={item.user_id || index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{item.name || "—"}</td>
                  <td className="px-4 py-2 border">{item.email || "—"}</td>
                  <td className="px-4 py-2 border text-center">{item.total_properties || 0}</td>
                  <td className="px-4 py-2 border text-right">₹{item.total_rent_received?.toLocaleString() || 0}</td>
                  <td className="px-4 py-2 border text-right text-red-600">
                    ₹{item.service_charge?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-2 border text-right font-semibold text-green-600">
                    ₹{item.current_balance?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
