const { Market } = require('../config/modelsConfig/index');
const AppError = require('../utils/AppError');


const getAllMarketsService = async () => {

    return await Market.findAll(
        {
            attributes: ['id', 'country_code', 'country_name', 'primary_currency', 'timezone', 'is_active'],
            where: {
                is_active: true
            },

            order: [['created_at', 'DESC']]
        });
}

const createMarket = async ({ country_code, country_name, primary_currency, timezone }) => {
    const existingMarket = await Market.findOne({ where: { country_code } });

    if (existingMarket) {
        throw new AppError("Market already exists for this country code.", 409);
    }

    const newMarket = await Market.create({
        country_code,
        country_name,
        primary_currency,
        timezone,
    });

    return newMarket;
};



module.exports = { getAllMarketsService, createMarket }