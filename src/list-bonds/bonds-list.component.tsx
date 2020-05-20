import React from 'react';
import { Bond } from '../models/bond.model';
import { BondsTableComponent } from './bonds-table.component';

export type BondsListProps = {
	list: Bond[];
}

type Filters = {
	minVolume: number,
	name: string,
	minToMature: number,
	maxToMature: number,
	onlyActive: boolean,
	onlyCheap: boolean,
}

type BondListState = { filters: Filters };

export class BondsListComponent extends React.Component<BondsListProps, BondListState> {
	state = {
		filters: {
			minVolume: 10000,
			minToMature: 30,
			maxToMature: 500,
			name: 'втб,сбер,гпб,рсхб,вэб,полюс,ржд,альфа',
			onlyActive: true,
			onlyCheap: true,
		},
	};

	render() {
		const list = this.props.list
			.filter(this.sanitize)
			.filter(this.filterOnlyActive)
			.filter(this.filterByName)
			.filter(this.filterOnlyCheap)
			.filter(this.filterByVolume)
			.filter(this.filterByToMature)
			.sort(this.sortByMatureDate);

		return (
			<div>
				<div>

				</div>
				<BondsTableComponent list={list} />
			</div>
		);
	}

	private sanitize = (bond: Bond) => {
		// todo accruedInterest is 0 in some cases (for subords)
		return bond.quote > 100 && bond.couponPeriod > 10 && (bond.accruedInterest > 0);
	};

	private sortByMatureDate = (i1: Bond, i2: Bond) => {
		return i1.matureDate > i2.matureDate ? 1 : -1;
	};

	private filterOnlyCheap = (item: Bond) => {
		return !this.state.filters.onlyCheap || item.couponValue < 100;
	};

	private filterOnlyActive = (item: Bond) => {
		return !this.state.filters.onlyActive || item.couponValue > 1;
	};

	private filterByName = (item: Bond) => {
		const { filters: { name } } = this.state;
		const names = name.split(',');
		return names.length === 0 || !!names.find(name => item.shortName.toLowerCase().startsWith(name));
	};

	private filterByVolume = (item: Bond) => {
		const { filters: { minVolume } } = this.state;
		return !minVolume || item.volume >= minVolume;
	};

	private filterByToMature = (item: Bond) => {
		const { filters: { minToMature, maxToMature } } = this.state;
		const toMature = item.matureDate.diffNow('days').days;
		return toMature >= minToMature && toMature <= maxToMature;
	};
}
