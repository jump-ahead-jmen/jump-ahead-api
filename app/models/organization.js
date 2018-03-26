'use strict'

const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  mission_statement: {
    type: String,
    required: false
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

// organizationSchema.virtual('length').get(function length () {
//   return this.text.length
// })

const Organization = mongoose.model('Organization', organizationSchema)

module.exports = Organization
