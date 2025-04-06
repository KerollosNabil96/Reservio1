import express from "express";
import cors from "cors";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

dotenv.config();

const stripe = Stripe(
  "sk_test_51QzGvr4GbI5RMdqvTvuYwrzUdOWVOuDQnldCbUjww32ZJYW0Fs3J8ggLvBeJZcyCC6cCBlDX6UsUUgmKfJxR5oj100ZXKXEPqr"
);
const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  "https://reservio-two.vercel.app", // Deployed frontend
  "http://localhost:5173", // Development frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reservio362@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Resolve directory path
const __dirname = path.dirname(
  path.resolve(
    decodeURIComponent(new URL(import.meta.url).pathname).substring(1)
  )
);

// Load the service account JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "adminsdk.json"), "utf8")
);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message, to, subject } = req.body;

  try {
    await transporter.sendMail({
      from: email,
      to: to || "reservio362@gmail.com",
      subject: subject || `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

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
      success_url: "https://reservio-two.vercel.app/booking-success",
      cancel_url: "https://reservio-two.vercel.app/booking-cancelled",
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
      success_url: "https://reservio-two.vercel.app/registration-success",
      cancel_url: "https://reservio-two.vercel.app/registration-cancelled",
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email sending endpoints
app.post("/send-contact-form", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const mailOptions = {
      from: email,
      to: "reservio362@gmail.com",
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact form:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

app.post("/api/send-rejection-email", async (req, res) => {
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

// API endpoint to delete a user from Firebase Authentication
app.post("/api/delete-user", async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().deleteUser(uid);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async (port) => {
  try {
    await new Promise((resolve, reject) => {
      const server = app
        .listen(port, () => {
          console.log(`Server running on port ${port}`);
          resolve();
        })
        .on("error", (error) => {
          if (error.code === "EADDRINUSE") {
            reject(new Error(`Port ${port} is already in use`));
          } else {
            reject(error);
          }
        });
    });
  } catch (error) {
    if (error.message.includes("already in use")) {
      console.log(`Trying port ${port + 1}...`);
      return startServer(port + 1);
    }
    console.error("Server error:", error);
    process.exit(1);
  }
};

startServer(PORT);
