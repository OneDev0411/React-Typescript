import { ComponentType, ReactElement } from 'react'

import { withRouter as legacyWithRouter } from 'react-router'

import { useNavigate } from '@app/hooks/use-navigate'
import { useSearchParams } from '@app/hooks/use-search-param'

import { ExtendedWithRouterProps, WithRouterProps } from './types'

export function withRouter<T extends WithRouterProps>(
  Component: ComponentType<T>
) {
  function ComponentWithRouterProp(
    componentProps: Omit<T, keyof ExtendedWithRouterProps>
  ): ReactElement<T> {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const extendedRouterProps: ExtendedWithRouterProps = {
      navigate,
      searchParams,
      setSearchParams
    }

    const props = { ...componentProps, ...extendedRouterProps } as T

    return <Component {...props} />
  }

  return legacyWithRouter(ComponentWithRouterProp)
}
