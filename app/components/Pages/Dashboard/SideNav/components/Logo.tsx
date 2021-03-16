import React, { useMemo } from 'react'
import { makeStyles, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { getBrandLogo } from '../../../../../utils/get-brand-logo'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      width: '100%',
      padding: theme.spacing(5, 2, 2.5)
    }
  }),
  { name: 'Logo' }
)

export default function Logo() {
  const classes = useStyles()
  const brand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const logo = useMemo(
    () => getBrandLogo(brand, '/static/images/logo--white--padded.svg'),
    [brand]
  )

  return <img alt="logo" className={classes.logo} src={logo} />
}
