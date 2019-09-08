import React from 'react'

import TextIconButton from 'components/Button/TextIconButton'
import ActionButton from 'components/Button/ActionButton'
import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import IconCalendar from 'components/SvgIcons/Calendar2/IconCalendar'

import {
  ActionSettingsType,
  ActionSettingsNamesType,
  FormatterOutputType
} from './types'

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
    const actionSettings = {
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
        onClick={() => props.setActionSettings(actionSettings)}
        size="small"
        text="Add Event"
      />
    )
  }

  // User
  const actionSettings = {
    type: ActionSettingsNamesType.CONTACT,
    data: {
      ...sharedProps,
      initValues: {
        email: props.data.data.email,
        first_name: props.data.meta.first_name,
        last_name: props.data.meta.last_name
      }
    }
  }

  return (
    <ActionButton onClick={() => props.setActionSettings(actionSettings)}>
      Add to Contacts
    </ActionButton>
  )
}

export default MiniContactActionButton
