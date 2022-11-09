import { ComponentType, ReactElement } from 'react'

import { withRouter as legacyWithRouter } from 'react-router'

import { useNavigate } from '@app/hooks/use-navigate'
import { useSearchParams } from '@app/hooks/use-search-param'

import { ExtendedWithRouterProps, WithRouterProps } from './types'

export function withRouter<T extends WithRouterProps>(
  Component: ComponentType<T>
) {
  function ComponentWithRouterProp(
    props: Exclude<T, keyof WithRouterProps<any>>
  ): ReactElement<T> {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const routerProps: ExtendedWithRouterProps = {
      navigate,
      searchParams,
      setSearchParams
    }

    return <Component {...props} {...routerProps} />
  }

  return legacyWithRouter(ComponentWithRouterProp)
}
