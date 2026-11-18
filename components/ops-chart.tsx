'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type QualitySnapshot = {
  label: string;
  constraint: number;
  source: number;
  route: number;
};

export function OpsChart({ data }: { data: QualitySnapshot[] }) {
  if (!data.length) {
    return (
      <div className="grid h-[256px] place-items-center rounded-lg border border-dashed border-[#e7ebe9] bg-[#fafcfb] text-center">
        <div>
          <p className="text-sm font-medium text-[#5a6963]">Waiting for a catalog check</p>
          <p className="mt-1 text-xs text-[#8a978f]">Run a check to view local record completeness.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[256px]" aria-label="Catalog quality trend">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 14, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid stroke="#eef2f0" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="label" tick={{ fill: '#8a978f', fontSize: 11 }} tickLine={false} />
          <YAxis axisLine={false} domain={[0, 100]} tick={{ fill: '#8a978f', fontSize: 11 }} tickLine={false} width={38} />
          <Tooltip contentStyle={{ border: '1px solid #e7ebe9', borderRadius: 8, boxShadow: '0 8px 24px rgba(16, 33, 29, 0.08)' }} formatter={(value) => value === undefined ? '—' : `${String(value)}%`} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Line dataKey="constraint" dot={false} name="Record validity" stroke="#0b5d3b" strokeWidth={2} type="monotone" />
          <Line dataKey="source" dot={false} name="Source coverage" stroke="#16a06a" strokeWidth={2} type="monotone" />
          <Line dataKey="route" dot={false} name="Planner input" stroke="#3a7bd5" strokeWidth={2} type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
