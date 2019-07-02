import React, { useState } from 'react'
import blogService from '../services/blogs'
import store from '../store'

const Blog = ({ blog, blogs, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [ showInfo, setShowInfo ] = useState(false)

  const showBlogDetails = () => {
    return (
      showInfo ? setShowInfo(false) : setShowInfo(true)
    )
  }

  const handleLike =  () => {
    return async () => {
      const changedBlog = {
        ...blog,
        likes: blog.likes+1,
        user: blog.user,
      }
      try {
        const response = await blogService.update(blog.id, changedBlog)
        store.dispatch({
          type: 'GET_BLOGS',
          data: blogs.map(b => b.id !== blog.id ? b : response)
        })
        setShowInfo(true)
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
    <div>
      <div style={blogStyle}>
        {showInfo ?
          <div className='showDetails' onClick={showBlogDetails}>
            {blog.title} {blog.author}
            <br/>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a><br/>
            <div className='likes'>{blog.likes} likes <button onClick={handleLike(blog.id)}>like</button></div>
            <p>added by {blog.user.username}</p>
            {blog.user.username === user.username ?
              <button onClick={removeBlog(blog.id)}>remove</button>
              :
            <></>}
          </div>
          :
          <div className='showList' onClick={showBlogDetails}>
            {blog.title} {blog.author}
          </div>}
      </div>
    </div>
  )}

export default Blog