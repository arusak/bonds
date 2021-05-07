import classnames from 'classnames';
import React from 'react';
import { BondViewModel } from '../../models/bond.view-model';
import { formatMillions, formatCurrency as rub } from '../../utils/string.utils';
import styles from './bonds-table.module.sass';

type BondsTableComponentProps = {
    list: BondViewModel[]
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

function renderRow(bond: BondViewModel) {
    return <tr className={styles.row} key={bond.isin}>
        <td className={styles.cellText} title={bond.name}>{bond.shortName}</td>
        <td className={styles.cellNumber} title={bond.matureDate.toFormat('dd.MM.yyyy')}>{bond.daysToMature}</td>
        <td className={styles.cellNumber}>{rub(bond.price)}</td>
        <td className={styles.cellNumber}>{rub(bond.couponValue)}</td>
        <td className={styles.cellNumber}>{bond.couponPeriod}</td>
        <td className={styles.cellNumber}>{bond.couponsToMature}</td>
        <td className={styles.cellNumber} title={`Спред ${bond.spread}`}>
            <span className={classnames({
                [styles.cellOk]: bond.volume > 5000000 && bond.volume < 10000000,
                [styles.cellGood]: bond.volume > 10000000,
            })}>{formatMillions(bond.volume)}</span>
        </td>
        <td className={styles.cellNumber}>{rub(bond.calculatedAccruedInterest)}</td>
        <td className={styles.cellNumber}>{rub(bond.totalCashFlow)}</td>
        <td className={styles.cellNumber}>{rub(bond.grossEarnings)}</td>
        <td className={styles.cellNumber}>{rub(bond.couponTax)}</td>
        <td className={styles.cellNumber}>{rub(bond.brokerFee + bond.exchangeFee)}</td>
        <td className={styles.cellNumber}>{rub(bond.netEarnings)}</td>
        <td className={styles.cellNumber}>{bond.netEarningsAnnualPercent}&thinsp;%</td>
        <td className={styles.cellText}>
            <a href={`https://www.rusbonds.ru/compare.asp?go=1&tool=${bond.isin}`}
               target="_blank"
               rel="noopener noreferrer">{bond.isin}</a>
        </td>
    </tr>;
}
