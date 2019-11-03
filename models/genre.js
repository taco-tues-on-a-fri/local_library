const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema(
  {
    name: {type: String, required: true, minlength: 3, maxlength: 100}
  }
);

// Virtual for genre URL
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

// Virtual for genre name
GenreSchema
.virtual('genre_name')
.get(function () {
  return this.name;
});

module.exports = mongoose.model('Genre', GenreSchema);