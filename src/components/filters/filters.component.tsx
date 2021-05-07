import classnames from 'classnames';
import { filter, fromNullable, map } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import React, { ChangeEvent, useState } from 'react';
import { FilterDiff, FiltersValues, isFilterName } from '../../models/filters.model';
import { getTransform } from '../../utils/filters.utils';
import { sequenceTOption } from '../../utils/option.utils';
import styles from './filters.module.sass';

type OnFiltersChange = (updated: FilterDiff) => void;
type FiltersComponentProps = { filters: FiltersValues, onFiltersChange: OnFiltersChange };

export const FiltersComponent = ({ filters, onFiltersChange }: FiltersComponentProps) => {
    const handleChange = makeChangeHandler(onFiltersChange);
    const [isMinimized, setMinimized] = useState(false);
    const mainCN = classnames({
        [styles.main]: true,
        [styles.main_minimized]: isMinimized,
    });
    const digestCN = classnames({
        [styles.digest]: true,
        [styles.digest_hidden]: !isMinimized,
    });
    const minimizerArrowCN = classnames({
        [styles.minimizer__arrow]: true,
        [styles.minimizer__arrow_up]: isMinimized,
    });
    const { minVolume, minToMature, maxToMature, minNetEarnings, maxNetEarnings, name } = filters;
    return (
        <div className={styles.container}>
            <div className={styles.minimizer_wrapper}>
                <button className={styles.minimizer} onClick={() => setMinimized(!isMinimized)}>
                    <span className={minimizerArrowCN}>»</span>
                </button>
            </div>
            <div className={digestCN}>
                {minVolume && <span>мин. об. {minVolume}, </span>}
                {(minToMature || maxToMature) && <span>срок {minToMature}—{maxToMature || '∞'}, </span>}
                {(minNetEarnings || maxNetEarnings) && <span>дох. {minNetEarnings}—{maxNetEarnings || '∞'}, </span>}
                {name && <span>название «{name}»</span>}
            </div>
            <div className={mainCN}>
                <div className={styles.parameter}>
                    <label htmlFor="minVolume">Объем за день, тыс. руб.</label>
                    <input type="number" id="minVolume" name="minVolume" defaultValue={minVolume}
                           onChange={handleChange}/>
                </div>
                <div className={styles.parameter}>
                    <label htmlFor="minToMature">Погашение через</label>
                    <input type="number" id="minToMature" name="minToMature" defaultValue={minToMature}
                           onChange={handleChange}/>
                    <span> — </span>
                    <input type="number" id="maxToMature" name="maxToMature" defaultValue={maxToMature}
                           onChange={handleChange}/>
                </div>
                <div className={styles.parameter}>
                    <label htmlFor="minToMature">Доходность</label>
                    <input type="number" id="minNetEarnings" name="minNetEarnings" defaultValue={minNetEarnings}
                           onChange={handleChange}/>
                    <span> — </span>
                    <input type="number" id="maxNetEarnings" name="maxNetEarnings" defaultValue={maxNetEarnings}
                           onChange={handleChange}/>
                </div>
                <div className={styles.parameter}>
                    <label htmlFor="maxToMature">По названию (через запятую)</label>
                    <input type="text" id="name" name="name" defaultValue={name} onChange={handleChange}/>
                </div>
            </div>
        </div>
    );
};

// return a function which transforms input from any field into a FilterDiff
const makeChangeHandler = (callback: OnFiltersChange) => (event: ChangeEvent<HTMLInputElement>) => {
    const key = pipe(fromNullable(event.target.getAttribute('name')), filter(isFilterName));
    const value = fromNullable(event.target.value);
    const transform = pipe(key, map(getTransform));
    const diffOption = pipe(sequenceTOption(key, value, transform), map(([key, value, transform]) => ({ [key]: transform(value) })));
    callback(diffOption);
};

