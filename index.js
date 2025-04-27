const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")
const axios = require('axios');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

app.get('/unstoppable/domains', async (req, res) => {
  const { query } = req.query;

  try {
    const response = await axios.get(`https://api.ud-sandbox.com/partner/v3/suggestions/domains?query=${query}`, {
      headers: {
        'Authorization': `Bearer ${process.env.UD_API_KEY}`
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Unstoppable API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch domain suggestions' });
  }
});

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