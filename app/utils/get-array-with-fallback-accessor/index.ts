export function getArrayWithFallbackAccessor<T>(arr: T[], fallback: T): T[] {
  return new Proxy(arr, {
    get: (target, key) => {
      if (typeof key === 'string' && /^-?\d+$/.test(key)) {
        return target[key] ?? fallback
      }

      return target[key]
    }
  })
}
