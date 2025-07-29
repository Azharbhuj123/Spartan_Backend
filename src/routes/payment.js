const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Book = require("../models/book");
const Campaign = require("../models/campaign");
const { payMethodTypes, bookingOrderStatus } = require("../utils/enums");

router.post("/booking-payment-intent", async (req, res) => {
  const { totalAmount, campaign, contactInfo } = req.body;
  const cents = parseInt(totalAmount) * 100;

  try {
    const createBooking = await Book.create(req.body);

    if (!createBooking) {
      return res.status(400).json({ error: "Booking not created" });
    }
    if (campaign) {
      const campaignData = await Campaign.findById(campaign);
      campaignData.redemBy?.push(contactInfo?.email);
      await campaignData.save();
    }

    if (createBooking?.paymentMethod == payMethodTypes[1]) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: cents,
        currency: "usd",
        payment_method_types: ["card"],
      });

      return res.send({
        payment: true,
        client_secret: paymentIntent.client_secret,
        createBooking,
        paymentMethod: payMethodTypes[1],
      });
    } else {
      return res.send({
        payment: true,
        book: true,
        paymentMethod: payMethodTypes[0],
        createBooking,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/update-book-status", async (req, res) => {
  const { orderId, paymentIntentId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      const updateBooking = await Book.findByIdAndUpdate(orderId, {
        status: bookingOrderStatus[1],
      });
      return res.send({
        payment: true,
        paymentIntent,
      });
    } else {
      return res.send({
        payment: false,
        paymentIntent,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
