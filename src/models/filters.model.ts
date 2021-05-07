import { Option } from 'fp-ts/lib/Option';

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

export type FilterName = keyof FiltersValues;

export const filtersNames: FilterName[] = [
    'minVolume',
    'name',
    'minToMature',
    'maxToMature',
    'onlyActive',
    'onlyCheap',
];

export type FilterDiff = Option<Partial<FiltersValues>>;

export const isFilterName = (key: string): key is FilterName => filtersNames.includes(key as FilterName);
