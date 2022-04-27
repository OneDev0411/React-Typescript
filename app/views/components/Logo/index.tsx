import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { getBrandLogo } from '@app/utils/get-brand-logo'
import { IAppState } from 'reducers'

interface LogoProps {
  className?: string
  fallbackUrl?: string
}

function Logo({
  className,
  fallbackUrl = '/static/images/logo--white--padded.svg'
}: LogoProps) {
  // Custom hostname brand
  const hostBrand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const brand = useUnsafeActiveBrand()
  const logo = useMemo(
    () => getBrandLogo(brand, hostBrand, fallbackUrl),
    [brand, hostBrand, fallbackUrl]
  )

  return <img alt="logo" className={className} src={logo} />
}

export default Logo
