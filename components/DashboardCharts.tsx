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
    <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
      <div className="mb-1 text-base font-bold text-[#17231D]">
        Capaian Rata-Rata per Fakultas
      </div>
      <p className="mb-3 text-xs text-[#849289]">Perbandingan capaian indikator unit kerja aktif</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 6, right: 10, left: -18, bottom: 0 }}
        >
          <CartesianGrid stroke="#E5EEE8" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#5B5A55" }}
            axisLine={{ stroke: "#DCE6DF" }}
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
              border: "1px solid #DCE6DF",
              borderRadius: 12,
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
