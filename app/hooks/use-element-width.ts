import { RefObject, useEffect, useState } from 'react'

import { getOuterWidth } from 'utils/get-outer-width'

export function useElementWidth(ref: RefObject<HTMLElement>) {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (ref.current) {
      setWidth(getOuterWidth(ref.current))
    }
  }, [ref])

  return width
}
