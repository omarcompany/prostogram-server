const Role = require("../models/role");

const roleTypes = ["USER", "ADMIN"];

module.exports.rolesInstance = () => {
  Role.find({}).then((roles) => {
    roleTypes.forEach((type) => {
      if (!roles.some((item) => item.value === type)) {
        Role.create({ value: type });
      }
    });
  });
};
