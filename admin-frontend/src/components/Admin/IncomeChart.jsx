import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

const API = import.meta.env.VITE_API_URL;

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"];

const formatINR = (num) => {
  if (!num) return "₹0";
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};



const IncomeChart = () => {
  const [carbon, setCarbon] = useState([]);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    axios.get(`${API}/admin/analytics`)
      .then(res => {
        setCarbon(res.data.carbon || []);
        setSubs(res.data.subscriptions || []);
      })
      .catch(err => console.error(err));
  }, []);

  // ✅ FIX: define data properly
  const data = buildMonthlyData(carbon, subs);

  const totalCarbonRevenue = sum(data, "carbon");
  const totalSubRevenue = sum(data, "subs");

  return (
    <div className="p-3 sm:p-6 bg-gray-100 min-h-screen space-y-6 sm:space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">📊 Business Dashboard</h1>
        <p className="text-gray-500">{new Date().toLocaleString()}</p>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card title="Carbon Revenue" value={formatINR(totalCarbonRevenue)} />
        <Card title="Subscription Revenue" value={formatINR(totalSubRevenue)} />
        <Card title="CO₂ Offset" value={`${sum(data, "tons")} tons`} />
        <Card title="Subscriptions" value={sum(data, "subsCount")} />

        <Card title="Avg Revenue" value={formatINR(totalCarbonRevenue / (data.length || 1))} />
        <Card title="Best Month" value={bestMonth(data)} />
        <Card title="Growth %" value={`${growth(data)}%`} />
        <Card title="Transactions" value={sum(data, "tx")} />
      </div>

      {/* MAIN GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Revenue Performance</h2>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatINR} />
            <Tooltip />
            <Legend />

            <Area dataKey="carbon" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            <Area dataKey="subs" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <InsightCard title="Revenue Split" value={`${percent(totalCarbonRevenue, totalSubRevenue)}%`} desc="Carbon vs Subscription" />
        <InsightCard title="Best Month" value={bestMonth(data)} desc="Highest earning" />
        <InsightCard title="Avg Monthly Revenue" value={formatINR(totalCarbonRevenue / (data.length || 1))} desc="Performance" />
      </div>

      {/* LOWER GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">

        <ChartCard title="Carbon Revenue">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatINR} />
            <Tooltip />
            <Bar dataKey="carbon" fill="#10b981" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Subscription Growth">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="subsCount" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ChartCard>

        {/* ✅ FIXED REVENUE SHARE */}
        <ChartCard title="Revenue Share">
          <PieChart width={250} height={250}>
            <Pie
              data={[
                { name: "Carbon", value: totalCarbonRevenue || 1 },
                { name: "Subscription", value: totalSubRevenue || 1 }
              ]}
              dataKey="value"
              outerRadius={100}
            >
              {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
            </Pie>
            <Tooltip formatter={(v) => formatINR(v)} />
          </PieChart>
        </ChartCard>

        <ChartCard title="CO₂ Offset Trend">
          <AreaChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="tons" stroke="#f59e0b" fill="#f59e0b" />
          </AreaChart>
        </ChartCard>

      </div>

      {/* EXTRA GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">User Activity & Conversion</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="subsCount" stroke="#6366f1" />
            <Line dataKey="tx" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

/////////////////////////////
// ✅ REAL MONTH BUILDER (FIXED)
/////////////////////////////

const buildMonthlyData = (carbon, subs) => {
  const map = {};

  carbon.forEach(c => {
   const key = c.month || c.date; // ✅ directly use backend month

    if (!map[key]) {
      map[key] = { month: key, carbon: 0, subs: 0, subsCount: 0, tons: 0, tx: 0 };
    }

    map[key].carbon += c.revenue || 0;
    map[key].tons += c.tons || 0;
    map[key].tx += c.count || 1;
  });

  subs.forEach(s => {
   const key = s.month || s.date;

    if (!map[key]) {
      map[key] = { month: key, carbon: 0, subs: 0, subsCount: 0, tons: 0, tx: 0 };
    }

    map[key].subs += s.revenue || 0;
    map[key].subsCount += s.count || 1;
  });

  const order = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return Object.values(map).sort((a, b) =>
    order.indexOf(a.month) - order.indexOf(b.month)
  );
};
/////////////////////////////
// HELPERS
/////////////////////////////

const sum = (arr, key) => arr.reduce((a, b) => a + (b[key] || 0), 0);

const percent = (a, b) => {
  if (!b) return 100;
  return ((a / (a + b)) * 100).toFixed(0);
};

const bestMonth = (data) => {
  if (!data.length) return "-";
  return data.reduce((max, curr) =>
    curr.carbon > max.carbon ? curr : max
  ).month;
};

const growth = (data) => {
  if (data.length < 2) return 0;
  return (((data[data.length - 1].carbon - data[0].carbon) / (data[0].carbon || 1)) * 100).toFixed(1);
};



/////////////////////////////
// UI
/////////////////////////////

const Card = ({ title, value }) => (
  <div className="bg-whitep-3 sm:p-5  rounded-xl shadow">
    <p className="text-gray-500 text-xs sm:text-xs sm:text-sm">{title}</p>
    <h2 className="text-lg sm:text-lg sm:text-xl md:text-2xl font-bold">{value}</h2>
  </div>
);

const InsightCard = ({ title, value, desc }) => (
  <div className="bg-white p-3 sm:p-5 rounded-xl shadow">
    <p className="text-gray-400 text-xs sm:text-xs sm:text-sm">{title}</p>
    <h3 className="text-lg sm:text-lg sm:text-xl md:text-2xl font-bold">{value}</h3>
    <p className="text-gray-500 text-xs mt-1">{desc}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-3 sm:p-5 rounded-xl shadow">
    <h3 className="mb-3 font-semibold text-lg sm:text-lg sm:text-xl">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);

export default IncomeChart;