import razorpayInstance from "../config/razorpay.js";
import crypto from "crypto";
import Payment from "../models/Payment.js";



export const createOrder = async (req, res) => {
  console.log("🔥 createOrder HIT", req.body);

  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount missing" });
    }

    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    return res.status(200).json(order);
  } catch (error) {
    console.log("❌ RAZORPAY ERROR", error);
    return res.status(500).json({ message: error.message });
  }
};




// payment verification 
export const verifyPayment = async (req, res) => {
  console.log("🔥 verifyPayment HIT", req.body);

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed ❌",
      });
    }

    // ✅ SAVE TO DB
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified & saved successfully ✅",
      payment,
    });
  } catch (error) {
    console.error("❌ VERIFY ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// get all payments


export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

// payment history 

export const paymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};

