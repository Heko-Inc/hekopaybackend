const Router = require('express').Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const KycController = require('./kyc.controller');
const KycSchema = require('./kyc.validator');
const upload = require('../middlewares/cloudinaryUpload');

// KYC Submission
Router.post(
  '/submissions',
  validateRequest(KycSchema.createSubmissionSchema),
  asyncMiddleware(KycController.createSubmission)
);

// Identity Verification
Router.post(
  '/submissions/:id/identity',
  validateRequest(KycSchema.identitySchema),
  asyncMiddleware(KycController.addIdentity)
);

// Address Proof
Router.post(
  '/submissions/:id/address',
  validateRequest(KycSchema.addressSchema),
  asyncMiddleware(KycController.addAddress)
);

// Business Documents
Router.post(
  '/submissions/:id/business-docs',
  validateRequest(KycSchema.businessDocsSchema),
  asyncMiddleware(KycController.addBusinessDocs)
);

// File Upload (for all document types)
Router.post(
  '/submissions/:id/upload',
  upload.single('file'),
  asyncMiddleware(KycController.uploadFile)
);

// Submission Finalization
Router.post(
  '/submissions/:id/submit',
  asyncMiddleware(KycController.submitForReview)
);

// Admin Review
Router.post(
  '/admin/submissions/:id/review',
  validateRequest(KycSchema.reviewSchema),
  asyncMiddleware(KycController.reviewSubmission)
);

// Get Submission Status
Router.get(
  '/submissions/:id',
  asyncMiddleware(KycController.getSubmission)
);

Router.post(
  '/submissions/:id/documents',
  validateRequest(KycSchema.documentSchema),
  asyncMiddleware(KycController.addDocument)
);

Router.get('/document-types', asyncMiddleware(KycController.getAllDocumentTypes));
module.exports = Router;