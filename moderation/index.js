const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Moderation Service');
});
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    try {
      await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content
        }
      });
    } catch (e) {
      return res
        .status(e.response.status)
        .send({ status: 'fail', message: e.message, data: e });
    }
  }
  console.log('Received Event', type);

  res.status(200).send({ status: 'OK' });
});

app.listen(4003, () => console.log('Listening on 4003'));
