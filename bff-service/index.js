import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { default as axios } from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
  console.log('\noriginalUrl', req.originalUrl); // products?res=all
  console.log('method', req.method); // POST, GET
  console.log('body', req.body); // { name: 'product-1', count: 12 }

  const recipient = req.originalUrl.split('/')[1];
  console.log('recipient', recipient);

  const recipientUrl = process.env[recipient];
  console.log('recipientUrl', recipientUrl);

  if (!recipientUrl) {
    return res.status(502).json({ error: 'Cannot process request' });
  }

  const axiosConfig = {
    method: req.method,
    url: `${recipientUrl}${req.originalUrl}`,
    ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
  };

  console.log('axiosConfig', axiosConfig);

  axios(axiosConfig)
    .then(({ data }) => {
      console.log('response from recipient', data);
      return res.json(data);
    })
    .catch((error) => {
      console.log('some error', JSON.stringify(error));

      if (error.response) {
        const { status, data } = error.response;
        return res.status(status).json(data);
      }
      return res.status(500).json({ error: error.message });
    });
});

app.listen(PORT, () => {
  console.log(`Express app listening to http://localhost:${PORT}`);
});
