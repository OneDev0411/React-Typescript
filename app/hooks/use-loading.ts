import { useState, useEffect } from 'react'

type UseLoading = [boolean, (isLoading: boolean) => void]

export function useLoading(initialIsLoading: boolean = false): UseLoading {
  const [isLoading, setIsLoading] = useState(initialIsLoading)

  return [isLoading, setIsLoading]
}

export function useLoadingEntities(
  entities: OptionalNullable<any>
): UseLoading {
  const [isLoading, setIsLoading] = useLoading(!entities)

  useEffect(() => {
    if (!entities) {
      setIsLoading(true)

      return
    }

    setIsLoading(false)
  }, [entities, setIsLoading])

  return [isLoading, setIsLoading]
}
