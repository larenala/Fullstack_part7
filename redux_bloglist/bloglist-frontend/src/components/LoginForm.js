import React from 'react'
import { useField } from '../hooks/index'
import blogService from '../services/blogs'
import loginService from '../services/login'
import store from '../store'

const LoginForm = () => {

  let username = useField('text')
  let password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.fields.value, password: password.fields.value,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      store.dispatch({
        type: 'SET_USER',
        data: user
      })
      username.resetfield.reset()
      password.resetfield.reset()
      store.dispatch({
        type: 'CREATE', 
        data: {
          notification: 'kirjautunut sisään',
          style: 'success'
      }})

      setTimeout(() => {
        store.dispatch({type: 'REMOVE', data: {
          notification: null,
          style: null
        }})
      }, 3000)
    } catch (exception) {
      store.dispatch({
        type: 'CREATE', 
        data: {
          notification: 'käyttäjätunnus tai salasana virheellinen',
          style: 'error'
      }})
      username.resetfield.reset()
      password.resetfield.reset()
      setTimeout(() => {
        store.dispatch({
          type: 'REMOVE', 
          data: {
            notification: null,
            style: null
          }})
        }, 3000)
    }
  }

  return (
    <div>
      <h2>Kirjaudu</h2>
      <form onSubmit={handleLogin}>
        <div>
          käyttäjätunnus
          <input { ...username.fields } />
        </div>
        <div>
          salasana
          <input { ...password.fields } />
        </div>
        <button type="submit">kirjaudu</button>
      </form>
    </div>
  )
}

export default LoginForm