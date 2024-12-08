// paymentRoutes.js
"use strict";

const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// Initialize Stripe with your secret key
// Make sure to use an environment variable for your secret key in production
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51NarfeFarHSDOBPz2Hm7JPNJoYc2d2BIXEfQ7PdkDAR9vp4qWB0EW6TX3klrOYLQm4bMmMYN6HpLRR3CG99QF2tO00zUrdJUWI");

// Create a Payment Intent (for a custom payment flow)
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Basic validation
    if (!amount || !currency) {
      return res.status(400).json({ error: "Missing amount or currency" });
    }

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // Send back the client secret
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a Checkout Session (for a hosted Stripe Checkout page)
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { lineItems, successUrl, cancelUrl } = req.body;

    // Basic validation
    if (!lineItems || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Missing lineItems, successUrl, or cancelUrl" });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Return the session ID to the client
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
