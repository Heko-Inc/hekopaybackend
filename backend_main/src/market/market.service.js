const { Market } = require('../config/modelsConfig/index');


const getAllMarketsService = async () => {

    return  await Market.findAll(
        {
        attributes: ['id', 'country_code', 'country_name', 'primary_currency', 'timezone', 'is_active'],
        where: {
            is_active: true
        },

        order: [['created_at', 'DESC']]
    });
}


module.exports = { getAllMarketsService }