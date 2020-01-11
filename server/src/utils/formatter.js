const BigNumber = require('bignumber.js');

//helper function to parse amount from csv and convert into ERC-20 token's 18 decimal digit
const parseAmount = (preformattedAmount) => {
    bn = new BigNumber(Number(preformattedAmount.trim()));
    tokenUnit = new BigNumber(10);
    tokenUnit = tokenUnit.exponentiatedBy(18);
    return (bn.multipliedBy(tokenUnit)).toPrecision();
}

//make amount to readable format
const readableBalance = (preformattedAmount) => {
    bn = new BigNumber(Number(preformattedAmount));
    tokenUnit = new BigNumber(10);
    tokenUnit = tokenUnit.exponentiatedBy(-18);
    return (bn.multipliedBy(tokenUnit)).toPrecision();

}

module.exports = { parseAmount, readableBalance }