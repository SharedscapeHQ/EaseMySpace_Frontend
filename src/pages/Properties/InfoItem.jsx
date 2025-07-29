export default function InfoItem({ label, value }) {
  return (
    <div className="bg-gray-100 border-2 border-zinc-200 px-4 py-3 rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}
