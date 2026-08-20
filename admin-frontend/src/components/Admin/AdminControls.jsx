import React from "react";
import { Card, CardContent } from "../Ui/card";
import { Button } from "../Ui/button";

const controls = [
  "Update Credit Pricing",
  "Approve Project",
  "View All Transactions",
  "Referral Program Control",
  "Modify Subscription Plans",
  "Download All Certificates",
  "Manage API Keys",
  "System Logs",
];

const AdminControls = () => {
  return (
    <Card>
      <CardContent className="py-6">
        <h2 className="text-lg font-bold mb-4">Admin Controls</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {controls.map((text, i) => (
            <Button key={i} variant="secondary">
              {text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminControls;
