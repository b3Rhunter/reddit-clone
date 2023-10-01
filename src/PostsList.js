import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState('votes');

  const handleUpvote = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      votes: increment(1)
    });
  };

  const handleDownvote = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      votes: increment(-1)
    });
  };

  useEffect(() => {
    const postsCollection = collection(db, 'posts');
    const postsQuery = query(
      postsCollection,
      orderBy(sortOption, 'desc'),  // Update orderBy based on sortOption
    ); 
    const unsubscribe = onSnapshot(postsQuery, snapshot => { 
      const newPosts = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      setPosts(newPosts);
    });

    return () => {
      unsubscribe();
    };
  }, [sortOption]);

  return (
    <div className='posts-cont'>
      <div className='sorting'>
        Sort by: 
        <button onClick={() => setSortOption('votes')}>Votes</button>
        <button onClick={() => setSortOption('timestamp')}>Timestamp</button>
      </div>
      {posts.map(post => (
        <div className='posts' key={post.id}>
        <div className='username'>
          <span>Posted by: {post.data.name}</span>
        </div>
        <div className='content'>
          <h2>{post.data.title}</h2>
          <p>{post.data.content}</p>
        </div>
          <div className='votes'>
            <button onClick={() => handleUpvote(post.id)}>⬆️</button>
            <button onClick={() => handleDownvote(post.id)}>⬇️</button>
            <span>Votes: {post.data.votes}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
