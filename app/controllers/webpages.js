'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Webpage = models.webpage

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Webpage.find().populate('_owner')
    .then(webpages => res.json({
      webpages: webpages.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    webpage: req.webpage.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const webpage = Object.assign(req.body.webpage, {
    _owner: req.user._id
  })
  Webpage.create(webpage)
    .then(webpage =>
      res.status(201)
        .json({
          webpage: webpage.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.webpage._owner  // disallow owner reassignment.

  req.webpage.update(req.body.webpage)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.webpage.remove()
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
  { method: setModel(Webpage), only: ['show'] },
  { method: setModel(Webpage, { forUser: true }), only: ['update', 'destroy'] }
] })
