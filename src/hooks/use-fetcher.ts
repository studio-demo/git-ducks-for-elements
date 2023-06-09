import { useEffect, useMemo, useState } from 'react';
import type { DataFetcher } from '../services/data-fetcher';
import type { Subscriber } from '../services/observable';
export interface Fetcher<T> {
    data: T | undefined;
    isLoading: boolean;
    hasError: boolean;
    error: unknown | null;
}

export function useFetcher<T>(
    fetcher: DataFetcher<T>,
    defaultValue?: T
): Fetcher<T> {
    const [data, setData] = useState<T>();
    const [isLoading, setLoading] = useState(!defaultValue);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const onData: Subscriber<T> = (emission) => {
            if (emission.type === 'success') {
                setData(emission.value);
            } else {
                setError(emission.error);
                setHasError(true);
            }

            setLoading(false);
        };

        fetcher.subscribe(onData);

        return () => fetcher.unsubscribe(onData);
    }, [fetcher]);

    return useMemo(
        () => ({ data: data || defaultValue, isLoading, hasError, error }),
        [data, defaultValue, isLoading, hasError, error]
    );
}
