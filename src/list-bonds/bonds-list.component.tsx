import React from 'react';
import { Bond } from '../models/bond.model';
import { BondsTableComponent } from './bonds-table.component';
import styles from './bonds-list.module.sass';

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
            maxToMature: 548,
            name: 'ингб,почтар,росморп,рсетилэ,сбер,северст,сзкк,спбго,татнфт,тойота,фолксв,фпк,рсхб,ржд,краснодкр,фск еэс,росатом,челяб,янао,самаробл,промсвб,альфа,башкорт,газпнф,газпрнеф,газпром,гпб,липецкоб,мособ,моэк,мрскце,мрскцп,мтс,мтс,новосиб,новсиб,норник,огк-2,россет,рсети,русгидро,транснф,трнф,хмао,откр,втб,москред,райфб,росбанк',
            onlyActive: true,
            onlyCheap: true,
        },
    };

    render() {
        const list = this.props.list
            .filter(this.sanitize)
            .filter(this.filterOnlyActive)
            // .filter(this.filterByName)
            .filter(this.filterOnlyCheap)
            // .filter(this.filterByVolume)
            .filter(this.filterByToMature)
            .sort(this.sortByMatureDate);

        return (
            <div>
                <h1 className={styles.title}>Облигации на Мосбирже</h1>
                <div className={styles.main}>
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
