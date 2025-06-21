const UserService = require('./user.service');

exports.updateBusinessInfo = async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.updateBusinessInfo(userId, req.body);
  res.sendResponse(result, "Business info updated successfully");
};
exports.customizeBusiness = async (req, res) => {
  const userId = req.params.id;
  const result = await UserService.customizeBusiness(userId, req.body, req.file);
  res.sendResponse(result, "Business customized successfully");
};
