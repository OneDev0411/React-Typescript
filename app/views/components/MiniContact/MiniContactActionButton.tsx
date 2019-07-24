import React from 'react'
import { connect } from 'react-redux'

import TextIconButton from 'components/Button/TextIconButton'
import Loading from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import IconCalendar from 'components/SvgIcons/Calendar2/IconCalendar'

import { FormatterOutputType } from './useProfile'
import { ActionSettingsType, ActionSettingsNamesType } from './types'

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

  const passedProps = {
    type: ActionSettingsNamesType.EVENT,
    data: {
      user: props.user,
      defaultAssociation: props.data.meta.association,
      onClose: () => props.setActionSettings({}),
      submitCallback: () => props.setActionSettings({})
    }
  }

  return (
    <>
      <TextIconButton
        appearance="outline"
        iconLeft={IconCalendar}
        onClick={() => props.setActionSettings(passedProps)}
        size="small"
        text="Add Event"
      />
    </>
  )
}

function reduxState(state) {
  return {
    user: state.user
  }
}

export default connect(reduxState)(MiniContactActionButton)
