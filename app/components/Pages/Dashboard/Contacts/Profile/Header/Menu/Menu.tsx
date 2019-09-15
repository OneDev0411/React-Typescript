import React from 'react'
import { Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SendEmailButton from 'components/SendEmailButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import EmailIcon from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import BirthDayIcon from 'components/SvgIcons/Birthday/IconBirthday'

import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import Chat from './ChatButton'
import { styles } from './styles'

const useStyles = makeStyles(styles, { name: 'HeaderMenu' })

interface Props {
  contact: IContact
}

export default function Menu({ contact }: Props) {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center">
      <SendEmailButton
        recipients={normalizeContactsForEmailCompose([contact])}
        render={({ onClick, testId }) => (
          <Button
            size="small"
            variant="outlined"
            onClick={onClick}
            data-test={testId}
            color="secondary"
            className={classes.button}
          >
            <EmailIcon className={classes.leftIcon} />
            Email
          </Button>
        )}
      />

      <Chat contact={contact} />

      <SendContactCard
        contact={contact}
        mediums="Email"
        buttonProps={{
          size: 'small'
        }}
      >
        <BirthDayIcon className={classes.leftIcon} />
        Send Card
      </SendContactCard>
    </Box>
  )
}
