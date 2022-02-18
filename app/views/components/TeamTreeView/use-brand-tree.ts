import { useState, useEffect, useCallback, useMemo } from 'react'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { getBrands } from 'models/BrandConsole/Brands'

export function useBrandTree() {
  const activeTeam = useUnsafeActiveTeam()
  const activeBrandId = activeTeam?.brand.id

  const [rootTeam, setRootTeam] = useState<IBrand | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : rootTeam ? [rootTeam] : []),
    [rootTeam]
  )

  useEffect(() => {
    setIsLoading(true)

    if (activeBrandId) {
      getBrands(activeBrandId)
        .then(({ data }) => {
          const tree = {
            ...data,
            children: getChildren(activeTeam, data, findParents(data))
          }

          setRootTeam(tree)
          setIsLoading(false)
        })
        .catch(e => {
          setIsLoading(false)
        })
    }
  }, [activeBrandId, activeTeam])

  const initialExpandedNodes = useMemo(
    () =>
      rootTeam
        ? [rootTeam.id, ...(rootTeam.children || []).map(team => team.id)]
        : [],
    [rootTeam]
  )

  return {
    rootTeam,
    isLoading,
    getChildNodes,
    initialExpandedNodes
  }
}

/**
 *
 * @param team
 * @param brand
 */
function getChildren(
  team: Nullable<IUserTeam>,
  brand: IBrand,
  parents: ReturnType<typeof findParents>
) {
  return brand.children?.filter(child => {
    if (child.children) {
      return getChildren(team, child, parents)
    }

    return hasAccessToBrand(team, brand, parents)
  })
}

/**
 *
 * @param brand
 * @param parents
 */
function findParents(
  brand: IBrand,
  parents: Record<string, IBrand> = {}
): Record<string, IBrand> {
  const children = brand.children || []

  children.forEach(child => {
    parents[child.id] = brand

    if (child.children) {
      return findParents(child, parents)
    }
  })

  return parents
}

/**
 * checks whether given brand has access to backoffice or not
 * @param team
 * @param brand
 */
function hasAccessToBrand(
  team: Nullable<IUserTeam>,
  brand: IBrand,
  parents: ReturnType<typeof findParents>
) {
  let currentBrand: IBrand | null = brand

  while (currentBrand) {
    if (team?.acl?.includes('BackOffice')) {
      return true
    }

    currentBrand = parents[currentBrand.id]
  }

  return false
}
