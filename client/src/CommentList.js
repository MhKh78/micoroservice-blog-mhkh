import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content = '';

    if (comment.status === 'approved') content = comment.content;
    if (comment.status === 'pending')
      content = 'This Comment Is Awaiting Moderation';
    if (comment.status === 'rejected')
      content = 'This Comment Has Been Rejected';

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

//  Old list
// export default ({ postId }) => {
//   const [comments, setComments] = useState([]);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4001/posts/${postId}/comments`
//       );

//       setComments(res.data);
//     } catch (e) {
//       alert(e);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const renderedComments = comments.map((comment) => {
//     return <li key={comment.id}>{comment.content}</li>;
//   });

//   return <ul>{renderedComments}</ul>;
// };
