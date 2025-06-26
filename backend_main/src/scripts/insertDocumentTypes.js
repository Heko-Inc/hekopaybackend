
const { v4: uuidv4 } = require('uuid');
const { KycDocumentType, Market } = require("./../config/modelsConfig");

const markets = [
  {
    id: 'b1cd9099-a271-4a2a-923c-babf670c3a22',
    countryCode: 'KE',
    countryName: 'Kenya',
    primaryCurrency: 'KES',
    timezone: 'Africa/Nairobi',
    isActive: true,
  },
];


const documentTypes = [
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
  //Bussiness Registration Certificate
  {
    id: uuidv4(),
    marketId: 'b1cd9099-a271-4a2a-923c-babf670c3a22',
    code: 'business_registration_certificate',
    displayName: 'Business Registration Certificate',
    description: 'Certificate of business registration in Kenya.',
    isRequired: false,
    validationRegex: '^\\d{10}$',
    isActive: true,
  },

  // Address Proof
  {
    id: uuidv4(),
    marketId: 'b1cd9099-a271-4a2a-923c-babf670c3a22',
    code: 'address_proof',
    displayName: 'Address Proof',
    description: 'Document to verify the user\'s address.',
    isRequired: true,
    validationRegex: '^(\\d{1,5}\\s[a-zA-Z]{2,}(\\s[a-zA-Z]{2,}){0,2},\\s[a-zA-Z]{2,},\\s\\d{5})$',
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