import { useState, useCallback, useRef, useEffect } from 'react';
import { handleApiError } from '@/services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showNotification?: boolean;
}

/**
 * Custom hook for API requests with automatic loading and error states
 */
export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (apiFunction: () => Promise<T>): Promise<T | null> => {
      // Reset error state
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction();

        if (!isMountedRef.current) return null;

        setState({ data: result, loading: false, error: null });

        // Call success callback
        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error: any) {
        if (!isMountedRef.current) return null;

        const errorMessage = handleApiError(error);
        
        setState({ data: null, loading: false, error: errorMessage });

        // Show notification if enabled
        if (options.showNotification !== false) {
          (window as any).showNotification?.({
            type: 'error',
            title: 'Error',
            message: errorMessage,
          });
        }

        // Call error callback
        if (options.onError) {
          options.onError(errorMessage);
        }

        return null;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiOptions = {}
) {
  const { execute, ...state } = useApi<TData>(options);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      return execute(() => mutationFn(variables));
    },
    [execute, mutationFn]
  );

  return {
    ...state,
    mutate,
  };
}

/**
 * Hook for queries (GET)
 */
export function useQuery<T = any>(
  queryFn: () => Promise<T>,
  options: UseApiOptions & { enabled?: boolean; refetchInterval?: number } = {}
) {
  const { enabled = true, refetchInterval } = options;
  const { execute, ...state } = useApi<T>(options);

  const refetch = useCallback(() => {
    if (enabled) {
      return execute(queryFn);
    }
    return Promise.resolve(null);
  }, [execute, queryFn, enabled]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [enabled]); // Only run on mount if enabled

  // Polling
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      refetch();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled, refetch]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Example usage:
 * 
 * // Simple API call
 * const { execute, loading, error } = useApi();
 * 
 * const handleSubmit = async () => {
 *   const result = await execute(() => casesService.create(data));
 *   if (result) {
 *     // Success
 *   }
 * };
 * 
 * // Mutation
 * const { mutate, loading } = useMutation(
 *   (data) => casesService.create(data),
 *   {
 *     onSuccess: () => navigate('/cases'),
 *     showNotification: true,
 *   }
 * );
 * 
 * // Query
 * const { data, loading, refetch } = useQuery(
 *   () => casesService.getAll(),
 *   {
 *     enabled: true,
 *     refetchInterval: 30000, // 30 seconds
 *   }
 * );
 */