import { useMemo } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { IAppState } from '@app/reducers'
import { getBrandLogo } from '@app/utils/get-brand-logo'

const useStyles = makeStyles(
  () => ({
    logo: {
      maxWidth: 160,
      maxHeight: 80,
      minHeight: 60
    }
  }),
  { name: 'Logo' }
)

export function Logo() {
  const classes = useStyles()

  const brand = useUnsafeActiveBrand()
  const hostBrand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )

  const logo = useMemo(
    () => getBrandLogo(brand, hostBrand, ''),
    [brand, hostBrand]
  )

  return (
    <Box mb={4}>
      <img
        src={logo || '/static/images/logo.svg'}
        className={classes.logo}
        alt={logo ? 'Brand Logo powered by Rechat' : 'Rechat logo'}
      />
    </Box>
  )
}
