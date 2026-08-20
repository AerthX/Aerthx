export const GST_PERCENTAGE = 0.18;

export const formatRupees = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);
};

export const paymentFees = {
  credit_card: {
    platformFeePercentage: 0.05,
    gatewayFeePercentage: 0.02,
    gatewayFeeFixed: 25,
    label: "Card",
  },
  paypal: {
    platformFeePercentage: 0.04,
    gatewayFeePercentage: 0.03,
    gatewayFeeFixed: 30,
    label: "PayPal",
  },
  google_pay: {
    platformFeePercentage: 0.03,
    gatewayFeePercentage: 0.01,
    gatewayFeeFixed: 20,
    label: "GPay",
  },
  phonepe: {
    platformFeePercentage: 0.035,
    gatewayFeePercentage: 0.015,
    gatewayFeeFixed: 15,
    label: "PhonePe",
  },
  net_banking: {
    platformFeePercentage: 0.02,
    gatewayFeePercentage: 0.005,
    gatewayFeeFixed: 10,
    label: "Net Banking",
  },
};

export const calculatePayment = (subtotal, method) => {
  const fee = paymentFees[method];

  const platformFee = subtotal * fee.platformFeePercentage;
  const gatewayFee =
    subtotal * fee.gatewayFeePercentage + fee.gatewayFeeFixed;

  const base = subtotal + platformFee + gatewayFee;
  const gst = base * GST_PERCENTAGE;

  const total = subtotal + platformFee + gatewayFee + gst;

  return {
    platformFee,
    gatewayFee,
    gst,
    total,
  };
};