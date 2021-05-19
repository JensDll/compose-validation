import { Field, TransformedField } from '../../composition/useValidation';

export const isNotNull = <T>(x: T | null): x is T => x !== null;

export const isObject = (x: any): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

export const isArray = (x: any): x is any[] => Array.isArray(x);

export const isField = <T>(x: any): x is Field<T> =>
  isObject(x) ? '$value' in x : false;

export const isTransformedField = <T>(x: any): x is TransformedField<T> =>
  isObject(x)
    ? '$uid' in x && '$value' in x && '$errors' in x && '$validating' in x
    : false;
