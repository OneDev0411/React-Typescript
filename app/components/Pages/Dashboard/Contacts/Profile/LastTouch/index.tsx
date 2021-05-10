import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import { mdiInformationOutline } from '@mdi/js'

import { LastTouched } from 'components/LastTouched'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: theme.spacing(3)
    },
    lastTouch: {
      display: 'inline-flex',
      alignItems: 'flex-start'
    },
    icon: {
      marginTop: '3px',
      marginRight: theme.spacing(1),
      color: theme.palette.grey[900]
    }
  }),
  { name: 'ContactProfileLastTouch' }
)

interface Props {
  contact: INormalizedContact
}

export const LastTouch = ({ contact }: Props) => {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Box className={classes.lastTouch}>
        <Box width="1.5rem">
          <SvgIcon
            path={mdiInformationOutline}
            size={muiIconSizes.small}
            className={classes.icon}
          />
        </Box>
        <LastTouched contact={contact} />
      </Box>
    </Box>
  )
}
