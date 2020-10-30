const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//   })
// );

const commentsByPostId = {};

app.get('/', (req, res) => {
  res.send('Comment Service');
});

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');

  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });
  try {
    axios.post('http://event-buz-srv:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        status: 'pending',
        postId: req.params.id,
      },
    });
  } catch (e) {
    return res
      .status(e.response.status)
      .send({ status: 'fail', message: e.message, data: e });
  }

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);

    comment.status = status;

    try {
      await axios.post('http://event-buz-srv:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          postId,
          status,
          content,
        },
      });
    } catch (e) {
      return res
        .status(e.response.status)
        .send({ status: 'fail', message: e.message, data: e });
    }
  }

  console.log('Received Event', req.body.type);

  res.status(200).send({ status: 'OK' });
});

app.listen(4001, () => console.log('listening on 4001'));
