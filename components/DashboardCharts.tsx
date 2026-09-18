"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DashboardCharts({
  data,
}: {
  data: { name: string; capaian: number }[];
}) {
  return (
    <div className="bg-white border border-[#E1DDCF] rounded-lg p-4">
      <div className="font-serif text-[15px] font-semibold mb-3">
        Capaian Rata-Rata per Fakultas
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 6, right: 10, left: -18, bottom: 0 }}
        >
          <CartesianGrid stroke="#E1DDCF" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#5B5A55" }}
            axisLine={{ stroke: "#E1DDCF" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#5B5A55" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12.5,
              borderRadius: 6,
              border: "1px solid #E1DDCF",
            }}
          />
          <Bar dataKey="capaian" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.capaian >= 80
                    ? "#3F6E52"
                    : d.capaian >= 50
                      ? "#B8862E"
                      : "#A6323A"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
