var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        first_name: { type: String, required: true, maxlength: 100 },
        family_name: { type: String, required: true, maxlength: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date },
    }
);

// Virtual for author's full name
AuthorSchema
    .virtual('name')
    .get(function () {

        // To avoid errors in cases where an author does not have either a family name or first name
        // We want to make sure we handle the exception by returning an empty string for that case

        var fullname = '';
        if (this.first_name && this.family_name) {
            fullname = this.family_name + ', ' + this.first_name
        }
        if (!this.first_name || !this.family_name) {
            fullname = '';
        }

        return fullname;
    });


AuthorSchema
    .virtual('date_of_birth_formatted')
    .get(function () {
        return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '';
    });


AuthorSchema
    .virtual('date_of_death_formatted')
    .get(function () {
        return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
    });

// Virtual for author's lifespan
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        return (this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '').toString() + ' - ' + (this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '').toString();
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

//Export model
module.exports = mongoose.model('Author', AuthorSchema);