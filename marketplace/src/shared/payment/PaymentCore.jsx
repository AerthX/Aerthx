import React, { useState } from "react";
import {
  calculatePayment,
  formatRupees,
  paymentFees,
} from "./paymentUtils";
import axios from "axios";

const PaymentCore = ({ subtotal,  meta }) => {
  const [method, setMethod] = useState("credit_card");

  const { platformFee, gatewayFee, gst, total } =
    calculatePayment(subtotal, method);

   const getDisplayConfig = () => {
  switch (method) {
    case "credit_card":
      return {
        blocks: {
          card: {
            name: "Card",
            instruments: [{ method: "card" }],
          },
        },
        sequence: ["card"],
      };

    case "google_pay":
    case "phonepe":
      return {
        blocks: {
          upi: {
            name: "UPI",
            instruments: [{ method: "upi" }],
          },
        },
        sequence: ["upi"],
      };

    case "net_banking":
      return {
        blocks: {
          netbanking: {
            name: "Net Banking",
            instruments: [{ method: "netbanking" }],
          },
        },
        sequence: ["netbanking"],
      };

    default:
      return {};
  }
};

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

    const handleRazorpayPayment = async () => {
  try {
     const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    
const normalizeMethod = () => {
  switch (method) {
    case "credit_card":
      return "card";
    case "google_pay":
    case "phonepe":
      return "upi";
    case "net_banking":
      return "netbanking";
    case "paypal":
      return "paypal";
    default:
      return null;
  }
};
    // 1. Create order from backend
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/payment/create-order`,
      {
        amount: total,
        paymentMethod: normalizeMethod(),
        ...meta,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` },
      }
    );


    // 2. Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Aerthx",
      description: "Subscription Payment",
      order_id: data.id,
      config: {
  display: getDisplayConfig(),
},

     handler: async function (response) {


  try {
const paymentMethod = normalizeMethod();

if (!paymentMethod) {
  alert("Invalid payment method");
  return;
}

const verifyRes = await axios.post(
  `${import.meta.env.VITE_API_URL}/payment/verify`,
 {
  ...response,
  ...meta,
  paymentMethod: paymentMethod,
},
{
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` },
}
);
    if (verifyRes.data.success) {
      alert("Payment verified ✅");
    } else {
      alert("Verification failed ❌");
    }
  } catch (err) {
  console.error("FULL ERROR:", err);

  if (err.response) {
    alert(err.response.data.message || "Backend error");
  } else {
    alert("Network / server error");
  }
}
},

      theme: {
        color: "#16a34a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error(error);
    alert("Payment failed");
  }
};

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
     <button
  onClick={handleRazorpayPayment}
  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
>
  Pay Now
</button>
    </div>
  );
};

export default PaymentCore;