const path = require("path");
const Uuid = require("uuid");

module.exports.saveFileAndGetURN = (file, dir) => {
  const mimeType = file.name.split(".").pop();
  const fileName = `${Uuid.v4()}.${mimeType}`;
  const route = path.basename(dir);
  const filePath = path.join(dir, fileName);
  file.mv(filePath);
  return `${route}/${fileName}`;
};
