exports.isValidEmail = (email) =>
  /^[^s@]+@[^s@]+.[^s@]+$/.test(email);

exports.isStrongPassword = (password) =>
  password.length >= 8;

exports.isValidObjectId = (id) =>
  /^[a-fA-F0-9]{24}$/.test(id);
