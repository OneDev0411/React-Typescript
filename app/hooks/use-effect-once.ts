import { useEffect } from 'react'

/**
 * this hooks acts as componentDidMoount and only runs once
 * @param handler - the useEffect function
 */
export function useEffectOnce(handler: () => any) {
  useEffect(handler, [])
}
