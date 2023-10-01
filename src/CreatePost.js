import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

const CreatePost = ({name}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePost = async () => {
    try {
      const postsCollection = collection(db, 'posts');
      await addDoc(postsCollection, {
        name,
        content,
        votes: 0,
        timestamp: serverTimestamp(),
      });
      alert('Post created successfully');
    } catch (error) {
      console.error(error);
      alert('Error creating post: ' + error.message);
    }
  };
  

  return (
    <div className='create-post'>
      <input className='title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input className='content' value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"></input>
      <button className='post-btn' onClick={handleCreatePost}>+</button>
    </div>
  );
};

export default CreatePost;
