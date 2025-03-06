import express from "express";
import cors from "cors";
import Stripe from "stripe";

const stripe = Stripe(
  "sk_test_51QzGvr4GbI5RMdqvTvuYwrzUdOWVOuDQnldCbUjww32ZJYW0Fs3J8ggLvBeJZcyCC6cCBlDX6UsUUgmKfJxR5oj100ZXKXEPqr"
);
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create a payment session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { venue, timeSlotId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "egp",
            product_data: {
              name: venue.venueName,
              description: `Booking for ${venue.category} - ${timeSlotId}`,
            },
            unit_amount: venue.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/booking-success",
      cancel_url: "http://localhost:5173/booking-cancelled",
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
