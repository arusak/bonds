import classnames from 'classnames';
import React from 'react';
import { Bond } from '../models/bond.model';
import styles from './bonds-table.module.sass';

type BondsTableComponentProps = {
    list: Bond[]
}

export const BondsTableComponent = (props: BondsTableComponentProps) => {
    const { list } = props;
    return (
        <table className={styles.table}>
            {renderHeader()}
            <tbody>
            {list.map(renderRow)}
            </tbody>
        </table>
    );
};

function renderHeader() {
    return (
        <thead>
        <tr className={styles.headRow}>
            {['Облигация', 'Срок', 'Цена', 'Купон', 'Пер-д', 'Осталось', 'Объем', 'НКД', 'Выплаты\nк погашению', 'Общий\nдоход, р', 'Налог', 'Комиссия, р', 'Чистый\nдоход, р', 'Доходность,\n% годовых', 'ISIN']
                .map((h, i) => <th key={i}>{h}</th>)}
        </tr>
        </thead>
    );
}

function renderRow(security: Bond) {
    const taxFraction = 0.13;
    const { nominal, shortName, name, matureDate, couponValue, isin, couponPeriod, volume, spread, quote } = security;

    const price = nominal * quote / 100;
    const brokerFee = price * 0.01 * 0.07;
    const exchangeFee = price * 0.01 * 0.01;
    const daysToMature = matureDate.diffNow('days').days | 0;
    const nextCoupon = (couponPeriod - daysToMature % couponPeriod - 1);
    const accruedInterestMy = (nextCoupon + 1) * couponValue / couponPeriod;
    const couponsToMature = Math.floor(daysToMature / couponPeriod) + 1;
    const totalCashFlow = couponsToMature * couponValue + nominal;
    const grossEarnings = totalCashFlow - accruedInterestMy - price;
    const couponTax = grossEarnings * taxFraction;
    const netEarnings = grossEarnings - couponTax - brokerFee - exchangeFee;
    const netEarningsPercent = Math.round(grossEarnings / price / daysToMature * 365 * 10000) / 100;

    return <tr className={styles.row} key={isin}>
        <td className={styles.cellText} title={name}>{shortName}</td>
        <td className={styles.cellNumber} title={matureDate.toFormat('dd.MM.yyyy')}>{daysToMature}</td>
        <td className={styles.cellNumber}>{$(price)}</td>
        <td className={styles.cellNumber}>{$(couponValue)}</td>
        <td className={styles.cellNumber}>{couponPeriod}</td>
        <td className={styles.cellNumber}>{couponsToMature}</td>
        <td className={styles.cellNumber} title={`Спред ${spread}`}>
            <span className={classnames({
                [styles.cellOk]: volume > 5000000 && volume < 10000000,
                [styles.cellGood]: volume > 10000000,
            })}>{formatMillions(volume)}</span>
        </td>
        <td className={styles.cellNumber}>{$(accruedInterestMy)}</td>
        <td className={styles.cellNumber}>{$(totalCashFlow)}</td>
        <td className={styles.cellNumber}>{$(grossEarnings)}</td>
        <td className={styles.cellNumber}>{$(couponTax)}</td>
        <td className={styles.cellNumber}>{$(brokerFee + exchangeFee)}</td>
        <td className={styles.cellNumber}>{$(netEarnings)}</td>
        <td className={styles.cellNumber}>{netEarningsPercent}&thinsp;%</td>
        <td className={styles.cellText}>
            <a href={`https://www.rusbonds.ru/compare.asp?go=1&tool=${isin}`}
               target="_blank"
               rel="noopener noreferrer">{isin}</a>
        </td>
    </tr>;
}

function $(value: number, digits = 2) {
    return value.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function formatMillions(value: number) {
    let millions = value / 1000000;
    return (millions >= 0.1 ? $(millions, 1) : '< 0,1') + ' млн.';
}
