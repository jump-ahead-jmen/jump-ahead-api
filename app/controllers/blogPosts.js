'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const BlogPost = models.blogPost

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  BlogPost.find().populate('_owner')
    .then(blogPosts => res.json({
      blogPosts: blogPosts.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    blogPost: req.blogpost.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const blogPost = Object.assign(req.body.blogPost, {
    _owner: req.user._id
  })
  BlogPost.create(blogPost)
    .then(blogPost =>
      res.status(201)
        .json({
          blogPost: blogPost.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.blogPost._owner  // disallow owner reassignment.

  req.blogpost.update(req.body.blogPost)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.blogpost.remove()
    .then(() => res.sendStatus(204))
    .catch(next)
}

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(BlogPost), only: ['show'] },
  { method: setModel(BlogPost, { forUser: true }), only: ['update', 'destroy'] }
] })
