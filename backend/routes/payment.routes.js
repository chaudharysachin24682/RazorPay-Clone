// import express from "express";
// import { createOrder, verifyPayment , paymentHistory} from "../controllers/payment.controller.js";
// import { getAllPayments } from "../controllers/payment.controller.js";




// const router = express.Router();

// router.post("/create-order", createOrder);
// router.post("/verify-payment", verifyPayment);
// router.get("/all-payments", getAllPayments);
// router.get("/history", paymentHistory);

// export default router; 



import express from "express";
import {
  createOrder,
  verifyPayment,
  paymentHistory,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);


router.get("/history", paymentHistory);

export default router;

