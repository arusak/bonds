import { DateTime } from 'luxon';

export type Bond = {
	shortName: string,
	name: string,
	matureDate: DateTime,
	settleDate: DateTime,
	offerDate: DateTime,
	isin: string,
	couponPercent: number,
	couponValue: number,
	nextCoupon: DateTime,
	accruedInterest: number,
	couponPeriod: number,
	averagePrice: number,
	quote: number,
	spread: number,
	volume: number,
	nominal: number,
}

export function securityFromApi(
	[SECID, BOARDID, SHORTNAME, PREVWAPRICE, YIELDATPREVWAPRICE, COUPONVALUE, NEXTCOUPON, ACCRUEDINT, PREVPRICE, LOTSIZE, FACEVALUE, BOARDNAME, STATUS, MATDATE, DECIMALS, COUPONPERIOD, ISSUESIZE, PREVLEGALCLOSEPRICE, PREVADMITTEDQUOTE, PREVDATE, SECNAME, REMARKS, MARKETCODE, INSTRID, SECTORID, MINSTEP, FACEUNIT, BUYBACKPRICE, BUYBACKDATE, ISIN, LATNAME, REGNUMBER, CURRENCYID, ISSUESIZEPLACED, LISTLEVEL, SECTYPE, COUPONPERCENT, OFFERDATE, SETTLEDATE, LOTVALUE]
		:
		[string, string, string, number, number, number, string, number, number, number, number, string, string, string, number, number, number, number, number, string, string, string, string, string, string, number, string, number, string, string, string, string, string, number, number, string, number, string, string, number],
	marketData: any[],
	yields: any[],
): Bond {
	return {
		shortName: SHORTNAME,
		name: SECNAME,
		matureDate: DateTime.fromISO(MATDATE),
		accruedInterest: ACCRUEDINT,
		couponPercent: COUPONPERCENT,
		couponPeriod: COUPONPERIOD,
		couponValue: COUPONVALUE,
		nextCoupon: DateTime.fromISO(NEXTCOUPON),
		isin: ISIN,
		offerDate: DateTime.fromISO(OFFERDATE),
		settleDate: DateTime.fromISO(SETTLEDATE),
		averagePrice: PREVWAPRICE,
		quote: yields ? yields[2] : 0,
		spread: marketData[5],
		volume: marketData[53],
		nominal: LOTVALUE,
	};
}
