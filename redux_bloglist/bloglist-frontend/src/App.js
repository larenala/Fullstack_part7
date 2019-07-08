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
import { Table, Button, Navbar, Nav } from 'react-bootstrap'

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
      <div>
          <div className='blogs'>
            <h2>Blogs</h2>
            <Togglable buttonLabel="Create new blog" class='button' ref={blogFormRef}>
              <CreateForm blogs={blogs} blogFormRef={blogFormRef} user={user}/>
            </Togglable>
            <Table striped>
              <tbody>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                </tr>
                {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
                <tr key={blog.id}>
                  
                  <td>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> 
                  </td>
                  <td>
                    {blog.author}
                  </td>
                </tr>)}
              </tbody>
            </Table>
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
          <Table striped>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Blogs created</th>
              </tr>
              {users.map(listedUser => 
              <tr key={listedUser.id}>
                <td><Link to={`/users/${listedUser.id}`}>{listedUser.name}</Link></td>
                <td>{listedUser.blogs.length}</td>
              </tr>)}
            </tbody>
          </Table>
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
      <Navbar collapseOnSelect expand="lg" bg="light">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
      
      
      <Nav className='mr-auto'>
        <Navbar.Brand href="/blogs">Blog App</Navbar.Brand>
            {user
            ? 
              <>
                <Nav.Item>
                  <Nav.Link href='' as='span'>
                    <Link to="/blogs">blogs</Link>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href='' as='span'>
                    <Link style={padding} to="/users">users</Link>
                  </Nav.Link>
                </Nav.Item>
                <Nav>
                  <Nav.Item>
                    <Nav.Link eventKey='disabled'>
                      <em>{user.name} logged in</em>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                  <Button onClick={logoutUser} id='logoutBtn'>logout</Button>   
                  </Nav.Item>
                </Nav>
                
              </>
            : <Nav>
                
              </Nav>  
          }
          </Nav> 
          </Navbar.Collapse>
        </Navbar> 

        <div className='notification'>
          <Notification />
        </div>
        <div className='container'> 
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