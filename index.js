const stripe = require('stripe')('sk_test_51N7udjKM0Vmt4Z7qDQgUvjyoDzJs0UcBxuGTTApWQqmEdU4DTVOAppRo2X61gvS2AnKWNh7IFfu2v4JeoyDx52QZ00auGXb1JT');
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.post('/payment', async (req, res) => {
  const {paymentMethodType, currency, amount} = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: [paymentMethodType],
    });

    res.json({clientSecret: paymentIntent.client_secret, success: true});

  } catch(e) {
    res.status(400).json({error: { message: e.message}});
  }
});

app.listen(4243, () => console.log('Running on port 4243'));