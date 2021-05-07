import { identity } from 'fp-ts/lib/function';
import { FilterName } from '../models/filters.model';

const numberTransform = (input: string): number => Number(input) || 0;
const nullTransform = identity;
const textTransform = (input: string): string => input.trim();

// converts input string into something for filter
const transforms: Record<FilterName, (input: string) => unknown> = {
    minVolume: numberTransform,
    maxToMature: numberTransform,
    minToMature: numberTransform,
    minNetEarnings: numberTransform,
    maxNetEarnings: numberTransform,
    name: textTransform,
    onlyActive: nullTransform,
    onlyCheap: nullTransform,
};

export const getTransform = (key: FilterName) => transforms[key];
