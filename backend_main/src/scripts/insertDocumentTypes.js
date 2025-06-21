
const { v4: uuidv4 } = require('uuid');
const { KycDocumentType, Market } = require("./config/modelsConfig");

const markets = [
  {
    id: 'f9dd0a99-4e4f-41d6-859f-ecc6fce1b331',
    countryCode: 'IN',
    countryName: 'India',
    primaryCurrency: 'INR',
    timezone: 'Asia/Kolkata',
    isActive: true,
  },
  {
    id: 'b1cd9099-a271-4a2a-923c-babf670c3a22',
    countryCode: 'KE',
    countryName: 'Kenya',
    primaryCurrency: 'KES',
    timezone: 'Africa/Nairobi',
    isActive: true,
  },
  {
    id: '2ab94657-fd08-42be-9b87-93ab1ac33d0f',
    countryCode: 'NG',
    countryName: 'Nigeria',
    primaryCurrency: 'NGN',
    timezone: 'Africa/Lagos',
    isActive: true,
  },
];


const documentTypes = [
  // 🇮🇳 India
  {
    id: uuidv4(),
    marketId: 'f9dd0a99-4e4f-41d6-859f-ecc6fce1b331',
    code: 'aadhaar',
    displayName: 'Aadhaar Card',
    description: 'Indian unique identity number (UIDAI).',
    isRequired: true,
    validationRegex: '^\\d{12}$',
    isActive: true,
  },
  {
    id: uuidv4(),
    marketId: 'f9dd0a99-4e4f-41d6-859f-ecc6fce1b331',
    code: 'pan_card',
    displayName: 'PAN Card',
    description: 'Permanent Account Number issued by Income Tax Dept.',
    isRequired: true,
    validationRegex: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
    isActive: true,
  },

  // 🇰🇪 Kenya
  {
    id: uuidv4(),
    marketId: 'b1cd9099-a271-4a2a-923c-babf670c3a22',
    code: 'id_card_kenya',
    displayName: 'Kenyan National ID',
    description: 'Kenya government-issued ID card.',
    isRequired: true,
    validationRegex: '^\\d{8}$',
    isActive: true,
  },
  {
    id: uuidv4(),
    marketId: 'b1cd9099-a271-4a2a-923c-babf670c3a22',
    code: 'kra_pin',
    displayName: 'KRA PIN Certificate',
    description: 'Kenya Revenue Authority PIN certificate.',
    isRequired: false,
    validationRegex: '^A[0-9]{9}[A-Z]$',
    isActive: true,
  },

  // 🇳🇬 Nigeria
  {
    id: uuidv4(),
    marketId: '2ab94657-fd08-42be-9b87-93ab1ac33d0f',
    code: 'nin',
    displayName: 'National Identity Number (NIN)',
    description: 'Issued by Nigerian Identity Management Commission.',
    isRequired: true,
    validationRegex: '^\\d{11}$',
    isActive: true,
  },
  {
    id: uuidv4(),
    marketId: '2ab94657-fd08-42be-9b87-93ab1ac33d0f',
    code: 'tin',
    displayName: 'Tax Identification Number (TIN)',
    description: 'Issued by the Federal Inland Revenue Service.',
    isRequired: false,
    validationRegex: '^\\d{10}$',
    isActive: true,
  },
];



(async () => {
  try {

    await Market.bulkCreate(markets); // insert markets
    await KycDocumentType.bulkCreate(documentTypes); // insert doc types
    console.log('✅ KYC Document Types inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error inserting KYC Document Types:', err);
    process.exit(1);
  }
})();