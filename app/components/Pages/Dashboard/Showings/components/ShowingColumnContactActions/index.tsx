import { MouseEvent, useState } from 'react'

import { Box } from '@material-ui/core'
import { mdiEmailOutline, mdiPhoneOutline } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { addNotification } from 'components/notification'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'
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
      {contact.phone_number && (
        <ShowingColumnContactIconLabel
          icon={<SvgIcon path={mdiPhoneOutline} />}
          label="Phone"
          marginRight={contact.phone_number ? spacing : 0}
          onClick={handleCopy}
          compact={compact}
        />
      )}
      {contact.email && (
        <ShowingColumnContactIconLabel
          icon={<SvgIcon path={mdiEmailOutline} />}
          label="Email"
          onClick={openEmailDrawer}
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
