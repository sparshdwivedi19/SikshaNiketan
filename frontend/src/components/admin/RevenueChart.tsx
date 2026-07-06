"use client";

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";

const platformRevenueData = [
  { name: 'Jan', value: 1200000 },
  { name: 'Feb', value: 1500000 },
  { name: 'Mar', value: 1350000 },
  { name: 'Apr', value: 1800000 },
  { name: 'May', value: 2200000 },
  { name: 'Jun', value: 2800000 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={platformRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/100000}L`} />
        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
