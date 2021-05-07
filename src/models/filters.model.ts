import { Option } from 'fp-ts/lib/Option';
import { exhaustiveStringTuple } from '../utils/type.utils';

export type FiltersValues = {
    minVolume: number,
    name: string,
    minToMature: number,
    maxToMature: number,
    minNetEarnings: number,
    maxNetEarnings: number,
    onlyActive: boolean,
    onlyCheap: boolean,
}

export type FiltersDiff = Option<Partial<FiltersValues>>;

export type FilterName = keyof FiltersValues;

// all the filter names for refinement
const filtersNames: FilterName[] = exhaustiveStringTuple<FilterName>()(
    'minVolume',
    'name',
    'minToMature',
    'minNetEarnings',
    'maxNetEarnings',
    'maxToMature',
    'onlyActive',
    'onlyCheap',
);

// refinement for filter names
export const isFilterName = (key: string): key is FilterName => filtersNames.includes(key as FilterName);
