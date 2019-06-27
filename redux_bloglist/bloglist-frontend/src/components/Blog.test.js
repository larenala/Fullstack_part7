import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import blogs from '../services/blogs';

test('when blogs are listed title and author are visible', () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 0
  }

  const component = render(
    <Blog blog = { blog } />
  )

  expect(component.container).toHaveTextContent(
    'Blog title Blog author'
  )
})

test('when bloglist opened, likes is not visible', () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 0
  }

  const component = render(
    <Blog blog = { blog } />
  )
  const div = component.container.querySelector('.showList')
  expect(div).not.toHaveTextContent(0)
})

test('when blog name is clicked, blog details are displayed', async () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 0,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: '5a437a9e514ab7f168ddf138',
      blogs: {}
    }
  }
  const user = {
    username: 'mluukkai'
  }
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog = { blog } onClick= { mockHandler } user={ user }/>
  )
  const div = component.container.querySelector('.showList')
  fireEvent .click(div)
  expect(div).toHaveTextContent('mluukkai')
})