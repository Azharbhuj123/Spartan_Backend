const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Book = require("../models/book");
const Campaign = require("../models/campaign");
const { payMethodTypes, bookingOrderStatus } = require("../utils/enums");
const { default: axios } = require("axios");

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_API } = process.env;
// Get access token from PayPal
async function generateAccessToken() {
console.log(PAYPAL_CLIENT_ID,"PAYPAL_CLIENT_ID",PAYPAL_SECRET,"PAYPAL_SECRET",PAYPAL_API,"PAYPAL_API");

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    "base64"
  );
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
} catch (error) {
  console.log(error,"akkakakakakaka");
}
}

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
    } else if(createBooking?.paymentMethod == payMethodTypes[0]) {
      const accessToken = await generateAccessToken();

      const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders`,
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: { 
                currency_code: "USD",
                value: totalAmount ,
              },
            },
          ],
          application_context: {
            shipping_preference: "NO_SHIPPING",
            return_url: `http://localhost:5174/status-redirect?orderId=${createBooking._id}&status=success`, // ✅ Where PayPal redirects after approval
            cancel_url: `http://localhost:5174/status-redirect?orderId=${createBooking._id}&status=cancel`, // Optional
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Find approval link
      const approvalUrl = response.data.links.find(
        (link) => link.rel === "approve"
      )?.href;
      console.log(approvalUrl,"approvalUrl");
      res.json({
        payment: true,
        book: true,
        paymentMethod: payMethodTypes[0],
        createBooking,
        orderId: response.data.id,
        approvalUrl,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/capture-paypal-order/:token/:orderId', async (req, res) => {
  const accessToken = await generateAccessToken();
  console.log(accessToken,"accessToken");
  const {token,orderId} = req.params;
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    }
  );

  res.json(response.data);
} catch (error) {
  res.status(500).json({ status:"CANCELLED", error: error.message });
  console.log(error);
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
