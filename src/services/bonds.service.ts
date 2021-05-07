import { BondModel, securityFromApi } from '../models/bond.model';

const BONDS_BASE_URL = 'https://iss.moex.com/iss/engines/stock/markets/bonds/boards/%BOARD%/securities.json';
const BONDS_BOARDS = ['TQCB', 'EQOB'];

export const getBonds = async (): Promise<BondModel[]> => {
    const urls = BONDS_BOARDS.map(board => BONDS_BASE_URL.replace('%BOARD%', board));
    const promises = await urls.map(async url => {
        const resp = await fetch(url);
        return await resp.json();
    });
    const jsons = await Promise.all(promises);
    const securities = jsons.reduce((res, cur) => res.concat(cur?.securities?.data), []);
    const marketData = jsons.reduce((res, cur) => res.concat(cur?.marketdata?.data), []);
    const yields = jsons.reduce((res, cur) => res.concat(cur?.marketdata_yields?.data), []);

    return securities.map((bond: any) => {
        const bondMarketData = marketData.find((item: any) => bond[0] === item[0]);
        const yieldsData = yields.find((item: any) => bond[0] === item[0]);
        return securityFromApi(bond, bondMarketData, yieldsData);
    });
};
