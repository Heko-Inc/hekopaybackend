const KycService = require('./kyc.service');

exports.createSubmission = async (req, res) => {
  const result = await KycService.createSubmission(req.user.id, req.body);
  res.sendResponse(result, "KYC submission started");
};

exports.addIdentity = async (req, res) => {
  const result = await KycService.addIdentity(req.params.id, req.body);
  res.sendResponse(result, "Identity verification added");
};

exports.addAddress = async (req, res) => {
  const result = await KycService.addAddress(req.params.id, req.body);
  res.sendResponse(result, "Address proof added");
};

exports.addBusinessDocs = async (req, res) => {
  const result = await KycService.addBusinessDocs(req.params.id, req.body);
  res.sendResponse(result, "Business documents added");
};

exports.uploadFile = async (req, res) => {
  const result = await KycService.uploadFile(req.params.id, req.file);
  res.sendResponse(result, "File uploaded successfully");
};

exports.submitForReview = async (req, res) => {
  const result = await KycService.submitForReview(req.params.id);
  res.sendResponse(result, "KYC submitted for review");
};

exports.reviewSubmission = async (req, res) => {
  const result = await KycService.reviewSubmission(
    req.params.id, 
    req.body, 
    req.user.id
  );
  res.sendResponse(result, "KYC review completed");
};

exports.getSubmission = async (req, res) => {
  const result = await KycService.getSubmission(req.params.id);
  res.sendResponse(result, "KYC submission retrieved");
};

exports.addDocument = async (req, res) => {
  const result = await KycService.addDocument(
    req.params.id,
    req.body.documentTypeId,
    req.body.documentValue,
    req.body.documentFileUrl
  );
  res.sendResponse(result, "Document added to KYC submission");
};

exports.getAllDocumentTypes = async (req, res) => {
  const { marketId, isRequired } = req.query;

  const where = {};
  if (marketId) where.marketId = marketId;
  if (isRequired !== undefined) where.isRequired = isRequired === 'true';

  const documentTypes = await KycService.getAllDocumentTypes({ where });

  res.sendResponse(documentTypes, 'KYC document types fetched');
};