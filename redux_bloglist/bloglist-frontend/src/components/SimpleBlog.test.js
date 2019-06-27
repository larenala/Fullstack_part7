import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

test('renders title', () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 0
  }

  const component = render(
    <SimpleBlog blog = { blog } />
  )

  expect(component.container).toHaveTextContent(
    'Blog title'
  )
})

test('renders author', () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 0
  }

  const component = render(
    <SimpleBlog blog = { blog } />
  )

  expect(component.container).toHaveTextContent(
    'Blog author'
  )
})

test('renders likes', () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 0
  }

  const component = render(
    <SimpleBlog blog = { blog } />
  )
  const div = component.container.querySelector('.likes')
  expect(div).toHaveTextContent(0)
})

it('clicking the button twice causes the event handler to be called twice', async () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 0
  }
  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog blog = { blog } onClick={ mockHandler } />
  )

  const button = getByText('like')
  fireEvent .click(button)
  fireEvent .click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})