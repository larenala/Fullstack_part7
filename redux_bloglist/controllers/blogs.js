const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})  
    .populate('user', { username: 1, name: 1 })

  response.json(blogs.map(b => b.toJSON()))
})

router.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
  
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
      
    const user = await User.findById(decodedToken.id)
  
    blog.user = user
  
    if (!blog.url || !blog.title ) {
      return response.status(400).send({ error: 'title or url missing'}).end()
    }
  
    if ( !blog.likes ) {
      blog.likes = 0
    }
  
    const result = await blog.save()
    user.blogs = user.blogs.concat(result)
    await user.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
  
})

router.post('/:id/comments', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  try {
    const comment = request.body.comments[request.body.comments.length-1]
    blog.comments = blog.comments.concat(comment)
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (request, response) => {
  const id = request.body.user.id
  const user = await User.findById(id)
  try {
    const { id, author, title, url, likes, comments } = request.body
  
    const blog = {
      id, author, title, url, likes, comments
    }
    blog.user = user
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, blog, { new: true })
    updatedBlog.user = user
    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
  
})

router.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === decodedToken.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

module.exports = router