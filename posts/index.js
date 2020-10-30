const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios').default;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

const posts = {};

app.get('/', (req, res) => {
  res.send('Post Service');
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');

  const { title } = req.body;

  posts[id] = { id, title };

  try {
    const data = await axios.post('http://localhost:4005/events', {
      type: 'PostCreated',
      data: {
        id,
        title,
      },
    });
  } catch (e) {
    console.log(e);
    return res

      .status(e.response.status)
      .send({ status: 'fail', message: e.message, data: e });
  }

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.status(200).send({ status: 'OK' });
});

app.on('SIGNIT', () => console.log('test'));

app.listen(4000, () => console.log('listening on 4000 yo'));
