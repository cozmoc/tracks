const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTrackInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isLength(data.name, {
      min: 6,
      max: 200
    })) {
    errors.name = 'Name must have at least 6 chars';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
