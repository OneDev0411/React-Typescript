import { useMemo, useState } from 'react'
import cuid from 'cuid'

/**
 * generates a CUID which is preserved during all renders
 */
export function useCuid() {
  const [result] = useState(useMemo(cuid, []))

  return result
}
