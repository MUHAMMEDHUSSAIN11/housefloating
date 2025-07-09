import { useCallback, useRef } from 'react';

export const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debouncedCallback, cancel };
};

// Usage in your component
export const useDebouncedWishlist = (delay: number = 300) => {
  const pendingOperations = useRef<Map<string, 'add' | 'remove'>>(new Map());

  const debouncedWishlistOperation = useCallback((
    operation: 'add' | 'remove',
    itemId: string,
    callback: () => Promise<void>
  ) => {
    // Cancel any pending operation for this item
    pendingOperations.current.set(itemId, operation);
    
    // Debounce the actual operation
    setTimeout(async () => {
      const latestOperation = pendingOperations.current.get(itemId);
      if (latestOperation === operation) {
        await callback();
        pendingOperations.current.delete(itemId);
      }
    }, delay);
  }, [delay]);

  return debouncedWishlistOperation;
};