import React from "react";
import { Card, CardContent } from "../Ui/card";
import {
  FaUsers,
  FaMoneyBill,
  FaChartLine,
  FaPowerOff,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers className="text-3xl text-green-600" />,
    label: "Total Customers",
    value: "3,248",
  },
  {
    icon: <FaMoneyBill className="text-3xl text-blue-600" />,
    label: "Total Income",
    value: "₹7,40,500",
  },
  {
    icon: <FaChartLine className="text-3xl text-yellow-600" />,
    label: "Current Credit Price",
    value: "₹350 / credit",
  },
  {
    icon: <FaPowerOff className="text-3xl text-red-600" />,
    label: "Accounts Suspended",
    value: "12",
  },
];

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-4 py-6">
            {stat.icon}
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
