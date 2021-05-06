import React from 'react'
import { Box, IconButton } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { mdiGiftOutline, mdiEmailOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import SendEmailButton from 'components/SendEmailButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import Chat from '../../../components/ChatButton'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      buttonContainer: {
        '&:not(:last-child)': {
          marginRight: theme.spacing(1)
        }
      },
      button: {
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.action.disabledBackground}`,
        '&[disabled] svg': {
          fill: theme.palette.action.disabled
        }
      }
    }),
  { name: 'HeaderMenu' }
)

interface Props {
  contact: INormalizedContact
}

export default function Menu({ contact }: Props) {
  const classes = useStyles()

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center" mb={1}>
      <Box className={classes.buttonContainer}>
        {/*
       // @ts-ignore js component */}
        <SendEmailButton
          recipients={normalizeContactsForEmailCompose([contact])}
          render={({ onClick, testId }) => (
            <IconButton
              onClick={onClick}
              data-test={testId}
              className={classes.button}
            >
              <SvgIcon path={mdiEmailOutline} size={muiIconSizes.medium} />
            </IconButton>
          )}
        />
      </Box>

      <Box className={classes.buttonContainer}>
        <Chat contact={contact} />
      </Box>
      <Box className={classes.buttonContainer}>
        {/*
       // @ts-ignore js component */}
        <SendContactCard
          contact={contact}
          mediums="Email"
          buttonRenderrer={({ disabled, onClick }) => (
            <IconButton
              onClick={onClick}
              disabled={disabled}
              className={classes.button}
            >
              <SvgIcon path={mdiGiftOutline} size={muiIconSizes.medium} />
            </IconButton>
          )}
        />
      </Box>
    </Box>
  )
}
