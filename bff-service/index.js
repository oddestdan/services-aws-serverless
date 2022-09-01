import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { default as axios } from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {
  console.log('\noriginalUrl', req.originalUrl); // products/main?res=all
  console.log('method', req.method); // POST, GET
  console.log('body', req.body); // { name: 'product-1', count: 12 }

  const recipient = req.originalUrl.split('/')[1];
  console.log('recipient', recipient);

  const recipientUrl = process.env[recipient];
  console.log('recipientUrl', recipientUrl);

  res.status(200).json(req.body || {});
});

app.listen(PORT, () => {
  console.log(`Express app listening to http://localhost:${PORT}`);
});
