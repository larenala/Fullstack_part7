import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import LoginForm from './LoginForm'

const Wrapper = (props) => {

  const onChange = (event) => {
    props.state.value = event.target.value
  }

  return (
    <LoginForm
      username={props.state.value}
      onSubmit={props.onSubmit}
      handleChange={onChange}
    />
  )
}

test('<LoginForm /> updates parent state and calls onSubmit', () => {
  const onSubmit = jest.fn()
  const state = {
    username: '',
    password: ''
  }

  const component = render(
    <Wrapper onSubmit={onSubmit} state={state} />
  )

  const input = component.container.querySelector('input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, { target: { username: 'lomakkeiden testaus on hankalaa' } })
  fireEvent.submit(form)

  expect(onSubmit.mock.calls.length).toBe(1)
  expect(state.value).toBe('lomakkeiden testaus on hankalaa')  
})