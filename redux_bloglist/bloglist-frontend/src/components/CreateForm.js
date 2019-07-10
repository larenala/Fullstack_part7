import React from 'react'
import blogService from '../services/blogs'
import Notification from './Notification'
import PropTypes from 'prop-types'
import { useField } from '../hooks/index'
import store  from '../store'
import { Button, Form } from 'react-bootstrap'

const CreateForm = ({ blogs, blogFormRef, user }) => {
  const addedTitle = useField('text')
  const addedAuthor = useField('text')
  const addedUrl = useField('text')

  const createNewBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    let title = addedTitle.fields.value
    let author = addedAuthor.fields.value
    let url = addedUrl.fields.value
    const createdBlog = { title, author, url, user }
    try {
      const response = await blogService.create(createdBlog)
      store.dispatch({
        type: 'GET_BLOGS',
        data: blogs.concat(response)
      })
      store.dispatch({
        type: 'CREATE',
        data: {
          notification: `a new blog ${title} by ${author}`,
          style: 'success'
        } })

      setTimeout(() => {
        store.dispatch({ type: 'REMOVE', data: {
          notification: null,
          style: null
        } })
      }, 3000)
    } catch (exception) {
      store.dispatch({
        type: 'CREATE',
        data: {
          notification: 'could not create new blog',
          style: 'error'
        } })

      setTimeout(() => {
        store.dispatch({ type: 'REMOVE', data: {
          notification: null,
          style: null
        } })
      }, 3000)
    }
    addedAuthor.resetfield.reset()
    addedTitle.resetfield.reset()
    addedUrl.resetfield.reset()
  }

  return (
    <div>
      <Notification />
      <h2>Lisää uusi blogi</h2>
      <Form onSubmit={createNewBlog}>
        <Form.Label>Title</Form.Label>
        <Form.Control { ...addedTitle.fields } />  <br/>
        <Form.Label>Author</Form.Label>
        <Form.Control { ...addedAuthor.fields } />  <br/>
        <Form.Label>URL</Form.Label>
        <Form.Control { ...addedUrl.fields } />   <br/>
        <Button variant='light' type='submit'>Lisää</Button>
      </Form>
    </div>
  )
}

CreateForm.propTypes = {
  blogs: PropTypes.array.isRequired,
}

export default CreateForm