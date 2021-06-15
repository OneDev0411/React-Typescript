import { MouseEvent, useState } from 'react'
import { Box } from '@material-ui/core'
import {
  MailOutline as MailOutlineIcon,
  Phone as PhoneIcon
} from '@material-ui/icons'

import { useDispatch } from 'react-redux'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'

import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { addNotification } from 'components/notification'

import copy from 'utils/copy-text-to-clipboard'

import ShowingColumnContactIconLabel from './ShowingColumnContactIconLabel'

interface ShowingColumnContactActionsProps {
  className?: string
  contact: IContact
  compact?: boolean
  spacing?: number
}

function ShowingColumnContactActions({
  className,
  contact,
  compact = false,
  spacing = 3
}: ShowingColumnContactActionsProps) {
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
    <Box className={className} onClick={handleClick}>
      {contact.email && (
        <ShowingColumnContactIconLabel
          icon={<MailOutlineIcon />}
          label="Email"
          marginRight={contact.phone_number ? spacing : 0}
          onClick={openEmailDrawer}
          compact={compact}
        />
      )}
      {contact.phone_number && (
        <ShowingColumnContactIconLabel
          icon={<PhoneIcon />}
          label="Phone"
          onClick={handleCopy}
          compact={compact}
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

export default ShowingColumnContactActions
