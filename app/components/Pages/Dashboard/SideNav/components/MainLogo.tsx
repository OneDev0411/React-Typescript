import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { getBrandLogo } from '@app/utils/get-brand-logo'
import { IAppState } from 'reducers'

interface LogoProps {
  className?: string
  fallbackLogo?: string
}

export default function MainLogo({
  className,
  fallbackLogo = '/static/images/logo--white.svg'
}: LogoProps) {
  // Custom hostname brand
  const hostBrand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const brand = useUnsafeActiveBrand()
  const logo = useMemo(
    () => getBrandLogo(brand, hostBrand, fallbackLogo),
    [brand, hostBrand, fallbackLogo]
  )

  return <img alt="logo" className={className} src={logo} />
}
