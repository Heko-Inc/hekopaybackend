const cloudinary = require('../utils/cloudinary');
const {
    KycSubmission,
    KycDocument,
    KycDocumentType
} = require('../config/modelsConfig');
const AppError = require('../utils/AppError');

exports.createSubmission = async (userId, data) => {
    return await KycSubmission.create({
        userId,
        ...data,
        status: 'draft',
        step: 1
    });
};

exports.addIdentity = async (submissionId, { idType, idValue, documentFileUrl }) => {
    const [_, submission] = await Promise.all([
        KycDocument.create({
            submissionId,
            documentTypeId: '3ee228f7-f831-412c-85f8-e626b0768cd9',
            documentValue: idValue,
            documentFileUrl
        }),
        KycSubmission.update({
            idType,
            step: 2
        }, { where: { id: submissionId } })
    ]);

    return { submissionId, idType };
};

exports.addAddress = async (submissionId, { addressLine, city, postalCode, country, addressProofUrl }) => {
    const [_, submission] = await Promise.all([
        KycDocument.create({
            submissionId,
            documentTypeId: '3ee228f7-f831-412c-85f8-e626b0768cd9',
            documentFileUrl: addressProofUrl
        }),
        KycSubmission.update({
            addressLine,
            city,
            postalCode,
            country,
            step: 3
        }, { where: { id: submissionId } })
    ]);

    return { submissionId, addressLine };
};

exports.addBusinessDocs = async (submissionId, { kraClearanceUrl, registrationCertUrl }) => {
    const submission = await KycSubmission.findByPk(submissionId);
    if (!submission) throw new AppError('Submission not found', 404);

    const docType = submission.registrationType === 'sole_proprietor'
        ? 'business_registration'
        : 'certificate_of_incorporation';

    await Promise.all([
        KycDocument.create({
            submissionId,
            documentTypeId: "eb1ce8da-2878-4bef-880b-22e4b511a7f3",
            documentFileUrl: registrationCertUrl
        }),
        kraClearanceUrl && KycDocument.create({
            submissionId,
            documentTypeId: '3ee228f7-f831-412c-85f8-e626b0768cd9',
            documentFileUrl: kraClearanceUrl
        }),
        KycSubmission.update({ step: 4 }, { where: { id: submissionId } })
    ]);

    return { submissionId, documentsAdded: true };
};

exports.uploadFile = async (submissionId, file) => {
    if (!file) throw new AppError('No file uploaded', 400);

    const result = await cloudinary.uploader.upload(file.path, {
        folder: `hekopay/kyc/${submissionId}`,
        resource_type: 'auto'
    });

    return {
        fileUrl: result.secure_url,
        publicId: result.public_id
    };
};

exports.submitForReview = async (submissionId) => {
    const submission = await KycSubmission.findByPk(submissionId, {
        include: [{
            model: KycDocument,
            where: { submissionId },
            required: false
        }]
    });

    if (submission.step < 4) {
        throw new AppError('Complete all KYC steps before submission', 400);
    }

    await submission.update({
        status: 'pending',
        submittedAt: new Date()
    });

    return { submissionId, status: 'pending' };
};

exports.reviewSubmission = async (submissionId, { status, rejectionReason }, adminId) => {
    if (!['approved', 'rejected'].includes(status)) {
        throw new AppError('Invalid review status', 400);
    }

    if (status === 'rejected' && !rejectionReason) {
        throw new AppError('Rejection reason required', 400);
    }

    await KycSubmission.update({
        status,
        rejectionReason,
        reviewedAt: new Date(),
        reviewedBy: adminId
    }, { where: { id: submissionId } });

    return { submissionId, status };
};

exports.getSubmission = async (submissionId) => {
    const submission = await KycSubmission.findByPk(submissionId, {
        include: [{
            model: KycDocument,
            as: 'documents'
        }]
    });

    if (!submission) throw new AppError('Submission not found', 404);

    return submission;
};

exports.addDocument = async (submissionId, documentTypeId, documentValue, documentFileUrl) => {
    return await KycDocument.create({
        submissionId,
        documentTypeId,
        documentValue,
        documentFileUrl
    });
};

exports.getAllDocumentTypes = async ({ where }) => {
    return await KycDocumentType.findAll({ where });
};