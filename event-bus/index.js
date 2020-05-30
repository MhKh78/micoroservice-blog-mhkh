const express = require('express');
const axios = require('axios').default;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const events = [];

app.get('/', (req, res) => {
  res.send('Even Bus Service');
});

app.post('/events', async (req, res) => {
  const event = req.body;
  events.push(event);

  // Error Handle *HERE* Might Not Be A Good Idead If We Have Event Sync
  try {
    await axios.post('http://localhost:4000/events', event);
    await axios.post('http://localhost:4001/events', event);
    await axios.post('http://localhost:4002/events', event);
    await axios.post('http://localhost:4003/events', event);
  } catch (e) {
    let status = 502;
    let message = e.message;

    if (e.response) {
      status = e.response.status;
      message = e.message;
    }
    if (e.status) {
      status = e.status;
      message = e;
    }

    return res.status(status).send({ status: 'fail', message, data: e });
  }

  res.status(200).send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => console.log('listening on 4005'));
