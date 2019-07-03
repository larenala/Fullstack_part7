import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route, Link, Redirect, withRouter
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { useField } from './hooks/index.js'
import store from './store'
import { connect } from 'react-redux'
import './index.css'

const App = () => {
  const { blogs } = store.getState()
  const [ users, setUsers ] = useState([]) 
  let username = useField('text')
  let password = useField('password')
  const { user } = store.getState()
  const blogFormRef = React.createRef()

  useEffect(() => {
    try {
      blogService.getAll().then(blogs =>       
        store.dispatch({
          type: 'GET_BLOGS',
          data: blogs
        })
      )
    } catch (exception) {
      console.log('exception ', exception)
    }

  }, [])

  useEffect(() => {
    try {
      userService.getAll().then(users => 
        setUsers(users)
      )
    } catch (exception) {
      console.log('exception ', exception)
    }
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      store.dispatch({
        type: 'SET_USER',
        data: user
      })
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    const uname=username.fields.value
    const pword = password.fields.value
    try {
      const user = await loginService.login({
        uname, pword,
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

  const loginForm = () => {
    return (
      <div className='login'>
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username.fields}
            password={password.fields}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  const logoutUser = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    store.dispatch({
      type: 'SET_USER',
      data: null
    })
    store.dispatch({
      type: 'CREATE', 
      data: {
        notification: 'kirjautunut ulos',
        style: 'success'
      }})

    setTimeout(() => {
      store.dispatch({
        type: 'REMOVE', 
        data: {
          notification: null,
          style: null
        }})
      }, 3000)
  }

  const Home = () => (
    <div>
      <div className='notification'>
        <Notification />
      </div>
      <div>
        { user === null ?
          loginForm() :
          <div className='blogs'>
            <h2>Blogs</h2>
            <p>{user.name} logged in</p>
            <button onClick={logoutUser}>Log out</button>
            <Togglable buttonLabel="lisää uusi blogi" ref={blogFormRef}>
              <CreateForm blogs={blogs} blogFormRef={blogFormRef} user={user}/>
            </Togglable>
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
              <Blog className='blog' key={blog.id} blog={blog} blogs={blogs} user={user} />
            )}
          </div>
        }
      </div>
    </div>
  )

  const Users = () => {
    console.log('users ', users)
    console.log('done')
      return (
      <div>
          { user === null ?
            loginForm() :
            <div>
              <h2>blogs</h2>
              <p>{user.name} logged in</p>
              <button onClick={logoutUser}>Log out</button>
              <h2>Users</h2>
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>blogs created</th>
                  </tr>
                  {users.map(user => 
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.blogs.length}</td>
                  </tr>)}
                </tbody>
              </table>
              
              
            </div>
          }
          </div>
    )
  }

  return (
    <div>
      <Router>
        <div>
          <Route exact path='/' render={() => <Home />} />
          <Route path='/users' render={() => <Users />} />
        </div>
      </Router>
    </div>
    
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
    style: state.style,
    blogs: state.blogs,
    user: state.user
  }
}

const ConnectedApp = connect(mapStateToProps)(App)

export default ConnectedApp