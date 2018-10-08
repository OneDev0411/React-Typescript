import React from 'react'

import { NotifyOffice } from '../../NotifyOffice'

import {
  ChecklistNewItemInputContainer,
  ChecklistNewItemInput,
  ChecklistNewItemCancel,
  ChecklistItemContainer,
  ChecklistItemNotifyOffice,
  ChecklistItemTitle
} from '../../styled'

export class CreateTaskForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notifyOffice: !props.checklist.is_deactivated
    }
  }

  toggleNotifyOffice = () =>
    this.setState({ notifyOffice: !this.state.notifyOffice })

  onKeyPress = e => {
    const { onFinish, checklist } = this.props
    const { notifyOffice } = this.state
    const { value } = e.target

    if (value.length === 0) {
      return false
    }

    if (e.which === 13) {
      onFinish(checklist.id, value, notifyOffice)
    }
  }

  render() {
    const { notifyOffice } = this.state
    const { checklist, showNotifyOption, onCancel, isSaving } = this.props

    if (isSaving) {
      return (
        <ChecklistItemContainer onClick={e => e.stopPropagation()}>
          <ChecklistItemTitle color="#003bdf" bold>
            Creating task ...
          </ChecklistItemTitle>
        </ChecklistItemContainer>
      )
    }

    return (
      <ChecklistItemContainer onClick={e => e.stopPropagation()}>
        <ChecklistItemTitle fullWidth={!showNotifyOption}>
          <ChecklistNewItemInputContainer>
            <ChecklistNewItemInput
              autoFocus
              placeholder="Name task and press enter"
              onKeyPress={this.onKeyPress}
            />
            <ChecklistNewItemCancel onClick={onCancel}>
              Cancel
            </ChecklistNewItemCancel>
          </ChecklistNewItemInputContainer>
        </ChecklistItemTitle>

        {showNotifyOption && (
          <ChecklistItemNotifyOffice isSelected>
            <NotifyOffice
              checklist={checklist}
              isSelected={notifyOffice}
              onChange={this.toggleNotifyOffice}
            />
          </ChecklistItemNotifyOffice>
        )}
      </ChecklistItemContainer>
    )
  }
}
