import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import {
  calculatePayment,
  formatRupees,
  paymentFees,
} from "./paymentUtils";
import axios from "axios";

const PaymentCore = ({ subtotal,  meta }) => {
 const navigate = useNavigate();

  const [method, setMethod] = useState("credit_card");

  const [paymentResult, setPaymentResult] = useState(null);

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
  setPaymentResult({
    success: false,
    title: "Payment Failed",
    message: "Razorpay could not be loaded. Please try again.",
  });
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

console.log("RAZORPAY KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);
console.log("RAZORPAY ORDER:", data);
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
      setPaymentResult({
        success: false,
        title: "Payment Failed",
        message: "Invalid payment method selected.",
      });
      return;
    }

    const verifyRes = await axios.post(
      `${import.meta.env.VITE_API_URL}/payment/verify`,
      {
        ...response,
        ...meta,
        paymentMethod,
      },
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("accessToken") || ""
          }`,
        },
      }
    );

    if (verifyRes.data.success) {
      setPaymentResult({
        success: true,
        title: "Payment Successful",
        message: "Your payment has been successfully completed and verified.",
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
      });
    } else {
      setPaymentResult({
        success: false,
        title: "Payment Failed",
        message:
          verifyRes.data.message ||
          "Payment verification failed. Please try again.",
      });
    }
  } catch (err) {
    console.error("FULL ERROR:", err);

    setPaymentResult({
      success: false,
      title: "Payment Failed",
      message:
        err.response?.data?.message ||
        "We could not verify your payment. Please try again.",
    });
  }
},

modal: {
  ondismiss: function () {
    setPaymentResult({
      success: false,
      title: "Payment Cancelled",
      message: "You closed the payment window before completing the payment.",
    });
  },
},

      theme: {
        color: "#16a34a",
      },
    };

 const rzp = new window.Razorpay(options);

rzp.on("payment.failed", function (response) {
  setPaymentResult({
    success: false,
    title: "Payment Failed",
    message:
      response.error?.description ||
      "Your payment could not be completed. Please try again.",
  });
});

rzp.open();

  } catch (error) {
    console.error("Payment error:", error);

    setPaymentResult({
      success: false,
      title: "Payment Failed",
      message:
        error.response?.data?.message ||
        "We could not start the payment. Please try again.",
    });
  }
};

  return (
    <>
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

    {paymentResult && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center">

          {/* Close button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>

          {/* Result icon */}
          <div className="flex justify-center mb-5">
            {paymentResult.success ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <FaCheckCircle className="text-green-600" size={52} />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <FaTimesCircle className="text-red-500" size={52} />
              </div>
            )}
          </div>

          {/* Title */}
          <h2
            className={`text-2xl font-extrabold mb-3 ${
              paymentResult.success
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {paymentResult.title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {paymentResult.message}
          </p>

          {/* Payment information */}
          {paymentResult.success && (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-gray-800">
                  {formatRupees(total)}
                </span>
              </div>

              {paymentResult.paymentId && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="font-medium text-gray-700 truncate max-w-[220px]">
                    {paymentResult.paymentId}
                  </span>
                </div>
              )}

              {paymentResult.orderId && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-medium text-gray-700 truncate max-w-[220px]">
                    {paymentResult.orderId}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Bottom message */}
          <p className="text-xs text-gray-400">
            Click × in the top-right to return to the home page.
          </p>
        </div>
      </div>
    )}
  </>
);
};

export default PaymentCore;