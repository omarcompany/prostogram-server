module.exports = class UserDataDto {
  id;
  name;
  email;
  avatar;
  about;
  isActivated;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.avatar = model.avatar;
    this.about = model.about;
  }
};
