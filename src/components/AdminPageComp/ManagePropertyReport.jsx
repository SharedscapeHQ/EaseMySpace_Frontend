import { useEffect, useState } from "react";
import { getAllPropertyReports, resolvePropertyReport } from "../../api/adminApi";
import toast from "react-hot-toast";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllPropertyReports();
        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Failed to fetch reports", err);
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleResolve = async (reportId) => {
    setResolvingId(reportId);
    try {
      const res = await resolvePropertyReport(reportId);

      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                is_resolved: true,
                resolved_at: new Date().toISOString(),
                resolved_by_name: res.data.resolverName || "Admin",
              }
            : r
        )
      );
      toast.success("Report resolved successfully!");
    } catch (err) {
      console.error("Failed to resolve report", err);
      toast.error("Failed to resolve report");
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No reports found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h1 style={{ fontFamily: "para_font" }} className="text-2xl font-semibold mb-4 text-gray-800">Property Reports</h1>
      <div className="grid gap-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className={`bg-white p-4 rounded-xl shadow-md border flex justify-between items-start ${
              r.is_resolved ? "opacity-90" : ""
            }`}
          >
            <div className="flex flex-col gap-1">
              <p className="font-medium text-gray-800">{r.report_type.replace("_", " ").toUpperCase()}</p>
              <p className="text-sm text-gray-500">
                Reported by {r.firstName} {r.lastName} | Property ID: {r.property_id}
              </p>
              {r.user_message && <p className="text-sm text-gray-600 mt-1">Message: {r.user_message}</p>}
              <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(r.created_at).toLocaleString()}</p>
              {r.is_resolved && (
                <p className="text-xs text-green-700 mt-2 font-medium">
                  ✅ Resolved {r.resolved_at ? `on ${new Date(r.resolved_at).toLocaleString()}` : ""}{" "}
                  {r.resolved_by_name ? `by ${r.resolved_by_name}` : ""}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={() => window.open(`/properties/${r.property_id}`, "_blank")}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
              >
                View Property
              </button>
              {!r.is_resolved && (
                <button
                  onClick={() => handleResolve(r.id)}
                  disabled={resolvingId === r.id}
                  className={`px-4 py-2 rounded-lg text-white text-sm transition ${
                    resolvingId === r.id ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {resolvingId === r.id ? "Resolving..." : "Resolve"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
