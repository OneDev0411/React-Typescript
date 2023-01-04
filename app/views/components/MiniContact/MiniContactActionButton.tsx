import Button from '@material-ui/core/Button'

import ActionButton from 'components/Button/ActionButton'
import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

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
  onSubmit?(event: IEvent, type: string): void
}

function MiniContactActionButton(props: MiniContactActionButtonType) {
  if (props.isLoading) {
    return <Loading />
  }

  const isContact = !!props.data.contact_id
  const sharedProps = {
    user: props.user,
    onClose: () => props.setActionSettings({}),
    submitCallback: (event: IEvent, type: string) => {
      props.setActionSettings({})
      props.onSubmit && props.onSubmit(event, type)
    }
  }

  // Contact
  if (isContact) {
    const actionSettings = {
      type: ActionSettingsNamesType.EVENT,
      data: {
        ...sharedProps,
        defaultAssociation: props.data.meta.association
          ? {
              ...props.data.meta.association,
              id: undefined
            }
          : null
      }
    }

    return (
      <Button
        onClick={() => {
          props.setActionSettings(actionSettings)
        }}
        variant="outlined"
        color="secondary"
        size="small"
      >
        Add Reminder
      </Button>
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
