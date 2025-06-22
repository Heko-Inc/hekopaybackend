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
// User endpoints
exports.getMyProfile = async (req, res) => {
  const result = await UserService.getUserById(req.user.id);
  res.sendResponse(result);
};

exports.updateMyProfile = async (req, res) => {
  const result = await UserService.updateUser(req.user.id, req.body);
  res.sendResponse(result, 'Profile updated successfully');
};

// Admin endpoints
exports.getAllUsers = async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  res.sendResponse(result);
};

exports.getUser = async (req, res) => {
  const result = await UserService.getUserById(req.params.userId);
  res.sendResponse(result);
};

exports.adminUpdateUser = async (req, res) => {
  const result = await UserService.adminUpdateUser(req.params.userId, req.body);
  res.sendResponse(result, 'User updated successfully');
};

exports.deactivateUser = async (req, res) => {
  await UserService.deactivateUser(req.params.userId);
  res.sendResponse(null, 'User deactivated successfully');
};

exports.activateUser = async (req, res) => {
  await UserService.activateUser(req.params.userId);
  res.sendResponse(null, 'User activated successfully');
};