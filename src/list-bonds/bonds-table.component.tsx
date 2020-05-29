import React from 'react';
import { Bond } from '../models/bond.model';
import styles from './bonds-table.module.sass';

type BondsTableComponentProps = {
	list: Bond[]
}

export const BondsTableComponent = (props: BondsTableComponentProps) => {
	const { list } = props;
	return (
		<>
			<h1>Облигации МБ ({list.length})</h1>
			<table>
				{renderHeader()}
				<tbody>
				{list.map(renderRow)}
				</tbody>
			</table>
		</>
	);
};

function renderHeader() {
	return (
		<thead>
		<tr className={styles.headRow}>
			{['Облигация', 'Срок', 'Цена', 'Купон', 'Период', 'Осталось', 'Объем', 'НКД', 'Полные выплаты\nк погашению', 'Общий доход', 'Годовых', 'ISIN']
				.map((h, i) => <th key={i}>{h}</th>)}
		</tr>
		</thead>
	);
}

function renderRow(security: Bond) {
	const { shortName, name, matureDate, couponValue, isin, couponPeriod, accruedInterest, volume, spread, quote } = security;
	const nominal = security.nominal;
	const price = nominal * quote / 100;
	const daysToMature = matureDate.diffNow('days').days | 0;
	const nextCoupon = (couponPeriod - daysToMature % couponPeriod - 1);
	const accruedInterestMy = nextCoupon * couponValue / couponPeriod;
	const couponsToMature = Math.floor(daysToMature / couponPeriod) + 1;
	const totalCashFlow = couponsToMature * couponValue + nominal;
	const totalEarnings = totalCashFlow - accruedInterestMy - price;
	const totalEarningsPercent = Math.round(totalEarnings / price / daysToMature * 365 * 10000) / 100;
	return <tr className={styles.row} key={isin}>
		<td className={styles.cellText} title={name}>{shortName}</td>
		<td className={styles.cellText} title={matureDate.toFormat('dd.MM.yyyy')}>{daysToMature}</td>
		<td className={styles.cellNumber}>{$(price)}</td>
		<td className={styles.cellNumber}>{$(couponValue)}</td>
		<td className={styles.cellNumber}>{couponPeriod}</td>
		<td className={styles.cellNumber}>{couponsToMature}</td>
		<td className={styles.cellNumber} title={`Спред ${spread}`}>{formatMillions(volume)}</td>
		<td className={styles.cellNumber}>{$(accruedInterestMy)} ({$(accruedInterest)})</td>
		<td className={styles.cellNumber}>{$(totalCashFlow)}</td>
		<td className={styles.cellNumber}>{$(totalEarnings)}</td>
		<td className={styles.cellNumber}>{totalEarningsPercent}&thinsp;%</td>
		<td className={styles.cellText}>{isin}</td>
	</tr>;
}

function $(value: number, digits = 2) {
	return value.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function formatMillions(value: number) {
	let millions = value / 1000000;
	return (millions >= 0.1 ? $(millions, 1) : '< 0,1') + ' млн.';
}
