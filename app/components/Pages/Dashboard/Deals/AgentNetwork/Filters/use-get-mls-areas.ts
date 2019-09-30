import { useEffect, useState } from 'react'

import { getMlsAreas } from 'models/listings/search/get-mls-areas'

export function useGetMlsArea(): IMLSArea[] {
  const [areas, setAreas] = useState<IMLSArea[]>([])

  useEffect(() => {
    async function getAreas() {
      const areas = await getMlsAreas()

      setAreas(areas)
    }

    getAreas()
  }, [])

  return areas
}
