import React, { useMemo } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { IAppState } from 'reducers'

import { getBrandLogo } from '../../../../../utils/get-brand-logo'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      width: '100%',
      padding: theme.spacing(5, 2, 3.5)
    }
  }),
  { name: 'Logo' }
)

export default function Logo() {
  const classes = useStyles()
  // Custom hostname brand
  const hostBrand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const brand = useUnsafeActiveBrand()
  const logo = useMemo(
    () =>
      getBrandLogo(brand, hostBrand, '/static/images/logo--white--padded.svg'),
    [brand, hostBrand]
  )

  return <img alt="logo" className={classes.logo} src={logo} />
}
