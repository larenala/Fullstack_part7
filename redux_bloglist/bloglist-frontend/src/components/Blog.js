import React from 'react'
import blogService from '../services/blogs'
import store from '../store'
import { useField } from '../hooks/index'
import { Button, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

const Blog = ({ viewedBlog, blogs, user }) => {
  const addedComment = useField('text')
  if (viewedBlog === undefined ) {
    return <Redirect to="/login" />
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

  const sendComment = async (event) => {
    event.preventDefault()
    let comment = addedComment.fields.value
    const commentedBlog = {
      ...viewedBlog,
      comments: viewedBlog.comments.concat(comment),
    }
    try {
      const response = await blogService.createComment(commentedBlog)
      store.dispatch({
        type: 'GET_BLOGS',
        data: blogs.map(b => b.id !== viewedBlog.id ? b : response)
      })
      addedComment.resetfield.reset()
    } catch (exception) {
      console.log('exception ', exception)
    }
  }

  return (
    <div style={blogStyle}>
      <h2>{viewedBlog.title} {viewedBlog.author}</h2>

      <br/>
      <a href={viewedBlog.url} target="_blank" rel="noopener noreferrer">{viewedBlog.url}</a><br/>
      <div className='likes'>{viewedBlog.likes} likes <Button onClick={handleLike(viewedBlog.id)} variant='light'>like</Button></div>
      <p>added by {viewedBlog.user.username}</p>
      {viewedBlog.user.username === user.username ?
        <Button onClick={removeBlog(viewedBlog.id)} variant='outline-danger'>remove</Button>
        :
          <></>}
      <h3>comments</h3>
      <Form onSubmit={sendComment}>
        <Form.Control {  ...addedComment.fields } />
        <Button type='submit'>add comment</Button>
      </Form>
      <ul>
        {viewedBlog.comments.map(comment => <li key={`${comment}:${(Math.random() * 100)}`} >{comment}</li> )}       
      </ul>
    </div>
  )
}


export default Blog