require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { API_GATEWAY_URL, API_KEY } = process.env;

app.post('/generate-terraform', async (req, res) => {
  const { user_input, provider } = req.body;
  const prompt = user_input;
//   const prompt = `Generate Terraform code for ${inputText} on ${provider}`;

  try {
    const response = await axios.post(API_GATEWAY_URL, { user_input: prompt }, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    console.log(typeof(response.data?.response), "response to api call");
    // Extract the Terraform code from Bedrock's response (adjust based on actual response structure)
    const terraformCode = response.data?.response || 'No code generated';
    // const terraformCode = response.data.completion?.[0]?.chunk?.text || 'No code generated';

    res.json({ terraformCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate Terraform code' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});