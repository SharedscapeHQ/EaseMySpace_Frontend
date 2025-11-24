import React, { useEffect, useState } from "react";
import { getPlatformRevenue } from "../../api/ownerApi";
import * as XLSX from "xlsx";

export default function PlatformRevenueTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPlatformRevenue()
      .then((res) => {
        setData(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching platform revenue:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter by user name or phone
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = data.filter(
      (item) =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(value) ||
        item.phone.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Export table to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "User Name": `${item.firstName} ${item.lastName}`,
        Phone: item.phone,
        Amount: item.amount,
        "Payment Date": new Date(item.paymentDate).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PlatformRevenue");
    XLSX.writeFile(wb, "PlatformRevenue.xlsx");
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={handleSearch}
          className="border px-4 py-2 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                User Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Payment Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-4"
                >
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{item.firstName} {item.lastName}</td>
                  <td className="px-4 py-2">{item.phone}</td>
                  <td className="px-4 py-2">₹{item.amount}</td>
                  <td className="px-4 py-2">
                    {new Date(item.paymentDate).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
