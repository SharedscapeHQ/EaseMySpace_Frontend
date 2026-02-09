import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PropertyPieChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h3 className="text-lg  text-indigo-700 mb-4">
        Status Overview
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            stroke="#fff"
            strokeWidth={2}
            cornerRadius={8}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: "0.85rem",
              color: "#4B5563",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
