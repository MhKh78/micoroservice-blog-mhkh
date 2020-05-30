import React, { useState } from 'react';
import axios from 'axios';

export default ({ postId }) => {
  const [content, setContent] = useState('');
  const [disabled, setDisabled] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    try {
      await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
        content
      });
    } catch (e) {
      setDisabled(false);
      alert(e);
    }

    setContent('');
    setDisabled(false);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        <button disabled={disabled} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
