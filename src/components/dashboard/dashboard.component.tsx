import { fold } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import React from 'react';
import { BondViewModel } from '../../models/bond.view-model';
import { FilterDiff, FiltersValues } from '../../models/filters.model';
import { BondsTableComponent } from '../bonds-table/bonds-table.component';
import { FiltersComponent } from '../filters/filters.component';
import styles from './dashboard.module.sass';

export type BondsListProps = {
    list: BondViewModel[];
}

type BondListState = { filters: FiltersValues };

export class DashboardComponent extends React.Component<BondsListProps, BondListState> {
    state = {
        filters: {
            minVolume: 10000,
            minToMature: 30,
            maxToMature: 548,
            minNetEarnings: 4,
            maxNetEarnings: 20,
            name: '',
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
            .filter(this.filterByNetEarnings)
            .sort(this.sortByMatureDate);

        return (
            <div>
                <h1 className={styles.title}>Облигации на Мосбирже</h1>
                <div className={styles.main}>
                    <FiltersComponent filters={this.state.filters} onFiltersChange={this.handleFiltersChange}/>
                    <div>
                        {/*{JSON.stringify(this.state.filters, null, 2)}*/}
                    </div>
                    <BondsTableComponent list={list}/>
                </div>
                <div className={styles.disclaimer}>
                    {/*<p>В таблице приведены облигации эмитентов с рейтингом не ниже A со сроками погашения от 1 до 18 мес.</p>*/}
                    <p>Расчёт не учитывает возможную оферту, амортизацию и переменный купон. Для принятия
                        инвестиционного решения
                        изучите информацию об облигации. Проще всего найти её по ISIN на <a
                            href="https://www.rusbonds.ru/compare.asp">сайте
                            Интерфакса</a>.</p>
                </div>
            </div>
        );
    }

    private handleFiltersChange = (diff: FilterDiff) => {
        pipe(diff, fold(() => null, diff => {
            const filters = {
                ...this.state.filters,
                ...diff,
            };
            this.setState({ filters });
        }));
    };

    private sanitize = (bond: BondViewModel) => {
        // todo accruedInterest is 0 in some cases (for subords)
        return bond.quote > 100 && bond.couponPeriod > 10 && (bond.accruedInterest > 0);
    };

    private sortByMatureDate = (i1: BondViewModel, i2: BondViewModel) => {
        return i1.matureDate > i2.matureDate ? 1 : -1;
    };

    private filterOnlyCheap = (item: BondViewModel) => {
        return !this.state.filters.onlyCheap || item.couponValue < 100;
    };

    private filterOnlyActive = (item: BondViewModel) => {
        return !this.state.filters.onlyActive || item.couponValue > 1;
    };

    private filterByName = (item: BondViewModel) => {
        const { filters: { name } } = this.state;
        const terms = name.toLowerCase().split(',');
        let currentItemName = item.shortName.toLowerCase();
        return name.length === 0 || !!terms.find(term => currentItemName.startsWith(term));
    };

    private filterByVolume = (item: BondViewModel) => {
        const { filters: { minVolume } } = this.state;
        return !minVolume || item.volume >= minVolume;
    };

    private filterByToMature = (item: BondViewModel) => {
        const { filters: { minToMature, maxToMature } } = this.state;
        const toMature = item.matureDate.diffNow('days').days;
        return toMature >= minToMature && (!maxToMature || toMature <= maxToMature);
    };

    private filterByNetEarnings = (item: BondViewModel) => {
        const { filters: { minNetEarnings, maxNetEarnings } } = this.state;
        const netEarnings = item.couponPercent; // todo
        return netEarnings >= minNetEarnings && (!maxNetEarnings || netEarnings <= maxNetEarnings);
    };
}
