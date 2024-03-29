import log from './config/logger';
import express from 'express';
import axios from 'axios';

log.info('hello world');

const app = express();

app.get('/info', (_req, res) => {
  res.send('hello world');
});

app.get('/axios', async (_req, res) => {
  const response = await axios.get('http://localhost:8080/info');
  res.send(response.data);
});

app.listen('8080');
