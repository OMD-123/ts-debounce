export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): (...args: Parameters<T>) => ReturnType<T> | void;
