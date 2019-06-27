import React from 'react'
import { render,  waitForElement } from '@testing-library/react'
jest.mock('./services/blogs')
import App from './App'

describe('<App />', () => {
  it('no blogs are rendered if user is not logged in', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)
    await waitForElement(
      () => component.container.querySelector('.login')
    )

    const blogs = component.container.querySelectorAll('.blog')
    expect(blogs.length).toBe(0)

    expect(component.container).not.toHaveTextContent(
      'React patterns'
    )

    expect(component.container).not.toHaveTextContent(
      'Go To Statement Considered Harmful'
    )

    expect(component.container).not.toHaveTextContent(
      'Canonical string reduction'
    )
  })

  it('blogs are shown when user is logged in', async() => {
    const user = {
      username: 'tester',
      token: '1231231214',
      name: 'Teuvo Testaaja'
    }
    localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    const component = render(
      <App />
    )
    await waitForElement(
      () => component.container.querySelector('.blogs')
    )
    component.rerender(<App />)
    const blogs = component.container.querySelectorAll('.blog')
    expect(blogs.length).toBe(0)

    expect(component.container).toHaveTextContent(
      'React patterns'
    )

    expect(component.container).toHaveTextContent(
      'Go To Statement Considered Harmful'
    )

    expect(component.container).toHaveTextContent(
      'Canonical string reduction'
    )
  })
})

