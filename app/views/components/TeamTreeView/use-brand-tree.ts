import { useState, useEffect, useCallback, useMemo } from 'react'

import { useSelector } from 'react-redux'

import { useActiveBrandId } from 'hooks/brand/use-active-brand-id'
import { getBrands } from 'models/BrandConsole/Brands'
import { selectUser } from 'selectors/user'

export function useBrandTree() {
  const user = useSelector(selectUser)
  const activeBrandId = useActiveBrandId()

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
            children: getChildren(user, data, findParents(data))
          }

          setRootTeam(tree)
          setIsLoading(false)
        })
        .catch(e => {
          setIsLoading(false)
        })
    }
  }, [activeBrandId, user])

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
 * @param user
 * @param brand
 */
function getChildren(
  user: IUser,
  brand: IBrand,
  parents: ReturnType<typeof findParents>
) {
  return brand.children?.filter(child => {
    if (child.children) {
      return getChildren(user, child, parents)
    }

    return hasAccessToBrand(user, brand, parents)
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
 * @param user
 * @param brand
 */
function hasAccessToBrand(
  user: IUser,
  brand: IBrand,
  parents: ReturnType<typeof findParents>
) {
  let currentBrand: IBrand | null = brand

  while (currentBrand) {
    const brandId = currentBrand.id
    const userTeam = user.teams?.find(team => team.brand.id === brandId)

    if (userTeam?.acl?.includes('BackOffice')) {
      return true
    }

    currentBrand = parents[currentBrand.id]
  }

  return false
}
