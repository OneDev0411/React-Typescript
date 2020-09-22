import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { getRootBrand } from 'utils/user-teams'
import { getBrands } from 'models/BrandConsole/Brands'

export function useBrandTree() {
  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const [rootTeam, setRootTeam] = useState<IBrand | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : rootTeam ? [rootTeam] : []),
    [rootTeam]
  )

  useEffect(() => {
    setIsLoading(true)

    const root = getRootBrand(user)

    if (root) {
      getBrands(root.id)
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
  }, [user])

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
      return filterTree(user, child, parents)
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
