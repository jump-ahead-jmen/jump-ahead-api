'use strict'

const mongoose = require('mongoose')

const webpageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
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

// webpageSchema.virtual('length').get(function length () {
//   return this.text.length
// })

const Webpage = mongoose.model('Webpage', webpageSchema)

module.exports = Webpage
