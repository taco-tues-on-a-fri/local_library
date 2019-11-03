const mongoose =  require('mongoose');
const moment   =  require('moment');
const Schema   =  mongoose.Schema;

const AuthorSchema = new Schema(
  {
    first_name    :  {type: String, required: true, max: 100},
    family_name   :  {type: String, required: true, max: 100},
    date_of_birth :  {type: Date},
    date_of_death :  {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  var lifetime_string='';
  if (this.date_of_birth) {
      lifetime_string=moment(this.date_of_birth).format('MMMM Do, YYYY');
      }
  lifetime_string+=' - ';
  if (this.date_of_death) {
      lifetime_string+=moment(this.date_of_death).format('MMMM Do, YYYY');
      }
  return lifetime_string
});

// Virtual for author's formatted birth date
AuthorSchema
.virtual('birth_date_formatted')
.get(function () {
  return this.date_of_birth ?
  moment(this.date_of_birth).format('YYYY/MM/DD') : '';
});

// Virtual for author's formatted death date
AuthorSchema
.virtual('death_date_formatted')
.get(function () {
  return this.date_of_death ?
  moment(this.date_of_death).format('YYYY/MM/DD') : '';
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

// Export model
module.exports = mongoose.model('Author', AuthorSchema);