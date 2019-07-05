import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route, Link, Redirect, withRouter
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import userService from './services/users'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import store from './store'
import { connect } from 'react-redux'
import './index.css'

const App = () => {
  const { blogs } = store.getState()
  const [ users, setUsers ] = useState([]) 
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

  const padding = {
    padding: 5
  } 

  
  const Home = () => (
    <div>
      <div className='notification'>
        <Notification />
      </div>
      <div>
          <div className='blogs'>
            <h2>Blog app</h2>
            <Togglable buttonLabel="create new" ref={blogFormRef}>
              <CreateForm blogs={blogs} blogFormRef={blogFormRef} user={user}/>
            </Togglable>
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
              <ul>
                <li key={blog.id}>
                  <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link> 
                </li>
              </ul>
              
            )}
          </div>
      </div>
    </div>
  )

  const Users = () => {
    if (user === null) {
      return null
    }
      return (
      <div>
            <div>
              <h2>Users</h2>
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>blogs created</th>
                  </tr>
                  {users.map(listedUser => 
                  <tr key={listedUser.id}>
                    <td><Link to={`/users/${listedUser.id}`}>{listedUser.name}</Link></td>
                    <td>{listedUser.blogs.length}</td>
                  </tr>)}
                </tbody>
              </table>
          </div>
      </div>
    )
  }

  const User = ({ viewedUser }) => {
    if (viewedUser === undefined) {
      return null
    }
    return (
      <div>
        <h2>{viewedUser.name}</h2>
        <h4>added blogs</h4>
        <ul>
          {viewedUser.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
        </ul>
      </div> 

    )
  }

  const userById = (id) =>
    users.find(user => user.id === id)

  const blogById = (id) =>  blogs.find(blog => blog.id === id)
   
  return (
    <div>
      <Router>
        
        <div>            
            {user
            ? 
              <div>
                <Link style={padding} to="/blogs">blogs</Link>
                <Link style={padding} to="/users">users</Link>
                <span>
                  {user.name} logged in <button onClick={logoutUser}>logout</button>
                </span>
              </div>
            : <Link to="/login">login</Link>
          }

          <Route exact path='/blogs/:id' render={( { match }) => 
             <Blog viewedBlog={blogById(match.params.id)} blogs={blogs} user={user}/>
          } />
          <Route exact path='/blogs' render={() => user ? <Home /> : <Redirect to='/login' /> } />
          <Route exact path='/users/:id' render={({ match }) => 
            <User viewedUser={userById(match.params.id)} />
          } />
          <Route exact path='/users' render={() => user ? <Users /> : <Redirect to="/login" /> } />
          <Route exact path='/login' render={() => !user ? <LoginForm /> : <Redirect to='blogs' /> } />
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