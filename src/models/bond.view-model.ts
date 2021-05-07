import { BondModel } from './bond.model';

export type BondViewModel = BondModel & {
    price: number,
    brokerFee: number,
    exchangeFee: number,
    daysToMature: number,
    nextCouponDays: number,
    calculatedAccruedInterest: number,
    couponsToMature: number,
    totalCashFlow: number,
    grossEarnings: number,
    couponTax: number,
    netEarnings: number,
    netEarningsAnnualPercent: number,
}

const taxFraction = 0.13;
const brokerFeeFraction = 0.07 * 0.01;
const exchangeFeeFraction = 0.01 * 0.01;

export const makeBondViewModel = (model: BondModel): BondViewModel => {
    const { nominal, matureDate, couponValue, couponPeriod, quote } = model;

    const price = nominal * quote / 100;
    const brokerFee = price * brokerFeeFraction;
    const exchangeFee = price * exchangeFeeFraction;
    const daysToMature = matureDate.diffNow('days').days | 0;
    const nextCouponDays = (couponPeriod - daysToMature % couponPeriod - 1);
    const calculatedAccruedInterest = (nextCouponDays + 1) * couponValue / couponPeriod;
    const couponsToMature = Math.floor(daysToMature / couponPeriod) + 1;
    const totalCashFlow = couponsToMature * couponValue + nominal;
    const grossEarnings = totalCashFlow - calculatedAccruedInterest - price;
    const couponTax = grossEarnings * taxFraction;
    const netEarnings = grossEarnings - couponTax - brokerFee - exchangeFee;
    const netEarningsAnnualPercent = Math.round(grossEarnings / price / daysToMature * 365 * 10000) / 100;

    return {
        ...model,
        price,
        brokerFee,
        exchangeFee,
        daysToMature,
        nextCouponDays,
        calculatedAccruedInterest,
        couponsToMature,
        totalCashFlow,
        grossEarnings,
        couponTax,
        netEarnings,
        netEarningsAnnualPercent,
    };
};
