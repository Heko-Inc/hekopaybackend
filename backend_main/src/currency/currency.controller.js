const currencyService = require("./currency.service");


const registerCurrency = async (req,res,next) =>{

    try {
        const { code, name } = req.body;

        const currency = await currencyService.registerCurrency({ code, name });
        res.status(201).json({ message: "Currency registered successfully", currency });
      } catch (error) {
        next(error);
      }
}




const getAllCurrencies = async (req, res, next) => {
    try {
      const onlyActive = req.query.onlyActive === "true";
      const currencies = await currencyService.getAllCurrencies({ onlyActive });
      res.status(200).json({ currencies });
    } catch (error) {
      next(error);
    }
  };



module.exports = {

    registerCurrency,
    getAllCurrencies

};