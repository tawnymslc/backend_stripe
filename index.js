const stripe = require('stripe')('sk_test_51N7udjKM0Vmt4Z7qDQgUvjyoDzJs0UcBxuGTTApWQqmEdU4DTVOAppRo2X61gvS2AnKWNh7IFfu2v4JeoyDx52QZ00auGXb1JT');
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")
const axios = require('axios');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

const client_id = 'a1093cada368474598dab64470686b36';
const client_secret = '167c5d5131024966b738fecde0d8132e';

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

app.post('/get-access-token', async (req, res) => {
  try {
      const accessToken = await obtainAccessToken();
      console.log(accessToken);
      res.json({ accessToken });
  } catch (error) {
      console.error('Error obtaining access token:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function obtainAccessToken() {
  try {
      const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
              headers: {
                  'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
          }
      );
      return response.data.access_token;
  } catch (error) {
      console.error('Error obtaining access token:', error);
      throw error; // Rethrow the error for proper handling in the calling function
  }
}

app.listen(4243, () => console.log('Running on port 4243'));