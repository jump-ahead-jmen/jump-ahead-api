'use strict'

const controller = require('lib/wiring/controller')
const models = require('app/models')
const Organization = models.organization

const authenticate = require('./concerns/authenticate')
const setUser = require('./concerns/set-current-user')
const setModel = require('./concerns/set-mongoose-model')

const index = (req, res, next) => {
  Organization.find()
    .then(organizations => res.json({
      organizations: organizations.map((e) =>
        e.toJSON({ virtuals: true, user: req.user }))
    }))
    .catch(next)
}

const show = (req, res) => {
  res.json({
    organization: req.organization.toJSON({ virtuals: true, user: req.user })
  })
}

const create = (req, res, next) => {
  const organization = Object.assign(req.body.organization, {
    _owner: req.user._id
  })
  Organization.create(organization)
    .then(organization =>
      res.status(201)
        .json({
          organization: organization.toJSON({ virtuals: true, user: req.user })
        }))
    .catch(next)
}

const update = (req, res, next) => {
  delete req.body.organization._owner  // disallow owner reassignment.

  req.organization.update(req.body.organization)
    .then(() => res.sendStatus(204))
    .catch(next)
}

const destroy = (req, res, next) => {
  req.organization.remove()
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
  { method: setModel(Organization), only: ['show'] },
  { method: setModel(Organization, { forUser: true }), only: ['update', 'destroy'] }
] })
