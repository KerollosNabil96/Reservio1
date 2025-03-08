import express from "express";
import cors from "cors";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const stripe = Stripe(
  "sk_test_51QzGvr4GbI5RMdqvTvuYwrzUdOWVOuDQnldCbUjww32ZJYW0Fs3J8ggLvBeJZcyCC6cCBlDX6UsUUgmKfJxR5oj100ZXKXEPqr"
);
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create a payment session (for booking venues)
app.post("/create-checkout-session-book", async (req, res) => {
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

// Create a payment session (for registering venues)
app.post("/create-checkout-session-register", async (req, res) => {
  try {
    const { venue } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "egp",
            product_data: {
              name: venue.venueName,
              description: `Registration fee for ${venue.category} - ${venue.venueName}`,
              metadata: {
                venueId: venue.id,
                category: venue.category,
                owner: venue.owner,
              },
            },
            unit_amount: 200 * 100, // 200 EGP registration fee
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        venueId: venue.id,
        category: venue.category,
        owner: venue.owner,
      },
      success_url: "http://localhost:5173/registration-success",
      cancel_url: "http://localhost:5173/registration-cancelled",
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Load environment variables
dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email sending endpoint
app.post("/send-rejection-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please try a different port.`
      );
      process.exit(1);
    } else {
      console.error("Server error:", error);
      process.exit(1);
    }
  });
