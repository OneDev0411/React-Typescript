import React from 'react'
import { Box, Button } from '@material-ui/core'
import { ButtonProps } from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import SendEmailButton from 'components/SendEmailButton'
import SendContactCard from 'components/InstantMarketing/adapters/SendContactCard'
import EmailIcon from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import BirthDayIcon from 'components/SvgIcons/Birthday/IconBirthday'

import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { useIconStyles } from '../../../../../../../styles/use-icon-styles'

import Chat from './ChatButton'
import { styles } from './styles'

const useStyles = makeStyles(styles, { name: 'HeaderMenu' })

interface Props {
  contact: INormalizedContact
}

export default function Menu({ contact }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center" mb={1}>
      {/*
       // @ts-ignore js component */}
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
            <EmailIcon className={iconClasses.rightMargin} />
            Email
          </Button>
        )}
      />

      <Chat contact={contact} />

      {/*
       // @ts-ignore js component */}
      <SendContactCard
        contact={contact}
        mediums="Email"
        buttonProps={
          {
            size: 'small',
            className: classes.button
          } as ButtonProps
        }
      >
        <BirthDayIcon className={iconClasses.rightMargin} />
        Send Card
      </SendContactCard>
    </Box>
  )
}
