import React from "react";
import { Card, CardContent } from "../Ui/card";
import { Button } from "../Ui/button";

const CarbonInventory = () => {
  return (
    <Card>
      <CardContent className="py-4">
        <h2 className="text-lg font-bold mb-4">Carbon Credit Inventory</h2>
        <div className="flex gap-2">
          <Button variant="outline">Add Credits</Button>
          <Button variant="destructive">Remove Credits</Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Total Available: <span className="font-semibold">4,200</span> credits
        </p>
      </CardContent>
    </Card>
  );
};

export default CarbonInventory;
