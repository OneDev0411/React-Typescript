import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import { mdiInformationOutline } from '@mdi/js'

import { LastTouched } from 'components/LastTouched'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { BasicSection } from '../components/Section/Basic'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      padding: theme.spacing(0, 1)
    },
    icon: {
      position: 'relative',
      top: theme.spacing(0.5),
      marginLeft: theme.spacing(1),
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
    <BasicSection title="Last Touch">
      <Box className={classes.wrapper}>
        <LastTouched contact={contact}>
          <SvgIcon
            path={mdiInformationOutline}
            size={muiIconSizes.small}
            className={classes.icon}
          />
        </LastTouched>
      </Box>
    </BasicSection>
  )
}
