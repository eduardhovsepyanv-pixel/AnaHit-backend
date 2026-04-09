const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/create-checkout-session", async (req, res) => {
  const { name, bread, quantity } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${bread} (Customer: ${name})` },
          unit_amount: 300, // $3 per bread
        },
        quantity: quantity,
      }],
      mode: "payment",
      success_url: "https://YOUR_FRONTEND_URL/success.html",
      cancel_url: "https://YOUR_FRONTEND_URL/index.html",
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 4242, () => console.log("Backend running"));