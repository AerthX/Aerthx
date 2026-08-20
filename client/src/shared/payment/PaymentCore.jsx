import React, { useState } from "react";
import {
  calculatePayment,
  formatRupees,
  paymentFees,
} from "./paymentUtils";

const PaymentCore = ({ subtotal }) => {
  const [method, setMethod] = useState("credit_card");

  const { platformFee, gatewayFee, gst, total } =
    calculatePayment(subtotal, method);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Payment Summary
      </h2>

      {/* PAYMENT METHODS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.keys(paymentFees).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`p-3 rounded-lg text-sm font-semibold transition ${
              method === m
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {paymentFees[m].label}
          </button>
        ))}
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatRupees(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span>{formatRupees(platformFee)}</span>
        </div>

        <div className="flex justify-between">
          <span>Gateway Fee</span>
          <span>{formatRupees(gatewayFee)}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>{formatRupees(gst)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-bold text-lg text-green-700">
          <span>Total</span>
          <span>{formatRupees(total)}</span>
        </div>
      </div>

      {/* BUTTON */}
      <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition">
        Pay Now
      </button>
    </div>
  );
};

export default PaymentCore;