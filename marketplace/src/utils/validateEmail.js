import axios from "axios";

export const validateEmailFrontend = async (email) => {
  const apiKey = import.meta.env.VITE_ABSTRACT_API_KEY;
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("❌ AbstractAPI frontend error:", err.message);
    return null;
  }
};
