import { MouseEvent, useState } from 'react'
import classNames from 'classnames'
import { Box, makeStyles } from '@material-ui/core'
import {
  MailOutline as MailOutlineIcon,
  Phone as PhoneIcon
} from '@material-ui/icons'

import { useDispatch } from 'react-redux'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { addNotification } from 'components/notification'

import copy from 'utils/copy-text-to-clipboard'

import ShowingDetailTabVisitorsIconLabel from './ShowingDetailTabVisitorsIconLabel'

const useStyles = makeStyles(
  {
    root: { opacity: 0 }
  },
  { name: 'ShowingDetailTabVisitorsColumnActions' }
)

interface ShowingDetailTabVisitorsColumnActionsProps {
  className?: string
  contact: IContact
}

function ShowingDetailTabVisitorsColumnActions({
  className,
  contact
}: ShowingDetailTabVisitorsColumnActionsProps) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false)

  const openEmailDrawer = () => setIsEmailDrawerOpen(true)
  const closeEmailDrawer = () => setIsEmailDrawerOpen(false)

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const handleCopy = () => {
    copy(contact.phone_number)
    dispatch(addNotification({ status: 'success', message: 'Copied' }))
  }

  return (
    <Box className={classNames(classes.root, className)} onClick={handleClick}>
      {contact.email && (
        <ShowingDetailTabVisitorsIconLabel
          icon={<MailOutlineIcon />}
          label="Email"
          marginRight={contact.phone_number ? 3 : 0}
          onClick={openEmailDrawer}
        />
      )}
      {contact.phone_number && (
        <ShowingDetailTabVisitorsIconLabel
          icon={<PhoneIcon />}
          label="Phone"
          onClick={handleCopy}
        />
      )}
      {contact.email && (
        <SingleEmailComposeDrawer
          isOpen={isEmailDrawerOpen}
          onClose={closeEmailDrawer}
          onSent={closeEmailDrawer}
          initialValues={{ to: normalizeContactsForEmailCompose([contact]) }}
        />
      )}
    </Box>
  )
}

export default ShowingDetailTabVisitorsColumnActions
