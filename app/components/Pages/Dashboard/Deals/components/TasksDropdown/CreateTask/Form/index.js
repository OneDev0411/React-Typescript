import React from 'react'

import { NotifyOffice } from '../../NotifyOffice'

import {
  ChecklistNewItemInputContainer,
  ChecklistNewItemInput,
  ChecklistNewItemCancel,
  ChecklistNewItemSave,
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
    const { value } = e.target

    if (value.trim().length === 0) {
      return false
    }

    if (e.which === 13) {
      this.props.onFinish(
        this.props.checklist.id,
        value,
        this.state.notifyOffice
      )
    }
  }

  handleSave = () =>
    this.props.onFinish(
      this.props.checklist.id,
      this.input.value,
      this.state.notifyOffice
    )

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
              ref={ref => (this.input = ref)}
              placeholder="Name task and press enter"
              onKeyPress={this.onKeyPress}
            />
            <ChecklistNewItemSave onClick={this.handleSave}>
              Save
            </ChecklistNewItemSave>

            <ChecklistNewItemCancel onClick={onCancel}>
              <i className="fa fa-times" />
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
