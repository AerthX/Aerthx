import React from "react";
import IncomeChart from "./IncomeChart";
import LiveUserControl from "./LiveUserControl";
import CarbonInventory from "./CarbonInventory";
import AdminControls from "./AdminControls";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Aearthex Admin Dashboard</h1>
      <IncomeChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveUserControl />
        <CarbonInventory />
      </div>
      <AdminControls />
    </div>
  );
};

export default AdminDashboard;

