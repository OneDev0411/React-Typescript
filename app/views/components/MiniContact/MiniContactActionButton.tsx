import React from 'react'

import TextIconButton from 'components/Button/TextIconButton'
import ActionButton from 'components/Button/ActionButton'
import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import IconCalendar from 'components/SvgIcons/Calendar2/IconCalendar'

import { ActionSettingsType, ActionSettingsNamesType, FormatterOutputType } from './types'

interface MiniContactActionButtonType {
  isLoading: boolean
  data: FormatterOutputType
  user: any
  actionSettings: ActionSettingsType
  setActionSettings: (items: ActionSettingsType) => void
}

function MiniContactActionButton(props: MiniContactActionButtonType) {
  if (props.isLoading) {
    return <Loading />
  }

  const isContact = !!props.data.contact_id
  const sharedProps = {
    user: props.user,
    onClose: () => props.setActionSettings({}),
    submitCallback: () => props.setActionSettings({})
  }

  // Contact
  if (isContact) {
    const passedProps = {
      type: ActionSettingsNamesType.EVENT,
      data: {
        ...sharedProps,
        defaultAssociation: props.data.meta.association
      }
    }

    return (
      <TextIconButton
        appearance="outline"
        iconLeft={IconCalendar}
        onClick={() => props.setActionSettings(passedProps)}
        size="small"
        text="Add Event"
      />
    )
  }

  // User
  const passedProps = {
    type: ActionSettingsNamesType.CONTACT,
    data: {
      ...sharedProps,
      initValues: {
        // We are supporting email right now,
        // other types of data should be added whenever needs like in Chat
        //  which have name and last_name
        email: props.data.data.email
      }
    }
  }

  return (
    <ActionButton onClick={() => props.setActionSettings(passedProps)}>
      Add to Contacts
    </ActionButton>
  )
}

export default MiniContactActionButton
