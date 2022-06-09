import { useMemo } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { IAppState } from '@app/reducers'
import { getBrandMarketingPalette } from '@app/utils/get-brand-marketing-palette'

const useStyles = makeStyles(
  () => ({
    logo: {
      maxWidth: 160,
      maxHeight: 80,
      minHeight: 60,
      objectFit: 'contain'
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

  const logo = useMemo(() => {
    console.log(getBrandMarketingPalette(brand, hostBrand))

    return (
      getBrandMarketingPalette(brand, hostBrand)?.['container-logo-wide'] ||
      null
    )
  }, [brand, hostBrand])

  return (
    <Box mb={4} display="flex" justifyContent="center">
      <img
        src={logo || '/static/images/logo.svg'}
        className={classes.logo}
        alt={logo ? 'Brand Logo powered by Rechat' : 'Rechat logo'}
      />
    </Box>
  )
}
