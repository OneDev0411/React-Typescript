import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import AddAssociation from 'components/AddAssociation'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      '& > div > button': {
        marginRight: theme.spacing(2)
      }
    }
  }),
  { name: 'AssociationsButtons' }
)

interface Props {
  disabled: boolean
}

export function AssociationsButtons({ disabled }: Props) {
  const classes = useStyles()

  return (
    <Box display="flex" className={classes.container}>
      <AddAssociation disabled={disabled} type="contact" />
      <AddAssociation disabled={disabled} type="listing" />
    </Box>
  )
}
