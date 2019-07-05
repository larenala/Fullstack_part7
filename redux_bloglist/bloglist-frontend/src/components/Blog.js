import React, { useState } from 'react'
import blogService from '../services/blogs'
import store from '../store'

const Blog = ({ viewedBlog, blogs, user }) => {
  if (viewedBlog === undefined ) {
    return null
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5
  }

  const handleLike =  () => {
    return async () => {
      const changedBlog = {
        ...viewedBlog,
        likes: viewedBlog.likes+1,
        user: viewedBlog.user,
      }
      try {
        const response = await blogService.update(viewedBlog.id, changedBlog)
        store.dispatch({
          type: 'GET_BLOGS',
          data: blogs.map(b => b.id !== viewedBlog.id ? b : response)
        })
      } catch (exception) {
        console.log('exception ', exception)
      }
    }
  }

  const removeBlog = (id) => {
    return async () => {
      const blogToRemove = blogs.find(b => b.id === id)
      try {
        if (window.confirm(`Poistetaanko ${blogToRemove.title}?`)) {
          await blogService.deleteItem(id)
          store.dispatch({
            type: 'GET_BLOGS',
            data: blogs.filter(b => b.id !== blogToRemove.id)
          })
        }
      } catch (exception) {
        console.log('exception ', exception)
      }

    }
  }
    return (
    <div style={blogStyle}>
      <h2>{viewedBlog.title} {viewedBlog.author}</h2>
       
          <br/>
          <a href={viewedBlog.url} target="_blank" rel="noopener noreferrer">{viewedBlog.url}</a><br/>
          <div className='likes'>{viewedBlog.likes} likes <button onClick={handleLike(viewedBlog.id)}>like</button></div>
          <p>added by {viewedBlog.user.username}</p>
          {viewedBlog.user.username === user.username ?
            <button onClick={removeBlog(viewedBlog.id)}>remove</button>
            :
          <></>}
          <h3>comments</h3>
    </div>
  )
}


export default Blog