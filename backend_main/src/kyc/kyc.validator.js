const Joi = require('joi');

exports.createSubmissionSchema = Joi.object({
  businessName: Joi.string().required(),
  tradingName: Joi.string().optional(),
  registrationType: Joi.string().valid('sole_proprietor', 'ltd_company').required(),
  registrationNumber: Joi.string().required(),
  kraPin: Joi.string().optional(),
  estimatedMonthlySales: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  socialMediaLink: Joi.string().uri().optional(),
  category: Joi.string().required(),
  subCategory: Joi.string().required()
});

exports.identitySchema = Joi.object({
  idType: Joi.string().valid('national_id', 'passport', 'driving_license').required(),
  idValue: Joi.string().required(),
  documentFileUrl: Joi.string().uri().required()
});

exports.addressSchema = Joi.object({
  addressLine: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  addressProofUrl: Joi.string().uri().required()
});

exports.businessDocsSchema = Joi.object({
  kraClearanceUrl: Joi.string().uri().optional(),
  registrationCertUrl: Joi.string().uri().required()
});

exports.reviewSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  rejectionReason: Joi.when('status', {
    is: 'rejected',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  })
});

exports.documentSchema = Joi.object({
  documentTypeId: Joi.string().required(),
  documentValue: Joi.string().required(),
  documentFileUrl: Joi.string().uri().required()
});