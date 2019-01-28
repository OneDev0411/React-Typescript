import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import RemoveIcon from 'components/SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

import LinkButton from 'components/Button/LinkButton'
import IconButton from 'components/Button/IconButton'

import { NotifyOffice } from '../NotifyOffice'

import { TextInput, Divider } from './styled'

class CreateTask extends React.Component {
  state = {
    isSaving: false,
    taskTitle: '',
    notifyOffice: !this.props.checklist.is_deactivated
  }

  handleKeyUp = e => {
    this.setState({
      taskTitle: e.target.value
    })

    if (e.target.value.length === 0) {
      return false
    }

    if (e.which === 13) {
      this.handleSave()
    }
  }

  handleChange = e =>
    this.setState({
      taskTitle: e.target.value
    })

  handleToggleNotifyOffice = () =>
    this.setState(state => ({
      notifyOffice: !state.notifyOffice
    }))

  handleSave = async () => {
    this.setState({
      isSaving: true
    })

    await this.props.onSave(
      this.props.checklist.id,
      this.state.taskTitle,
      this.state.notifyOffice
    )

    this.props.onClose()
  }

  render() {
    const { props } = this

    return (
      <Flex alignCenter justifyBetween style={{ margin: '1rem 0' }}>
        <Flex style={{ flex: 1 }}>
          <TextInput
            autoFocus
            placeholder="Name task and press enter to save"
            onKeyUp={this.handleKeyUp}
          />
        </Flex>

        <Flex alignCenter justifyEnd>
          <LinkButton
            disabled={this.state.isSaving}
            style={{ paddingRight: '0.5rem' }}
            onClick={this.handleSave}
          >
            {this.state.isSaving ? 'Saving...' : 'Save'}
          </LinkButton>

          {!this.state.isSaving && (
            <React.Fragment>
              <IconButton isFit iconSize="medium" onClick={props.onClose}>
                <RemoveIcon />
              </IconButton>

              <Divider />

              <NotifyOffice
                isSelected={this.state.notifyOffice}
                checklist={props.checklist}
                onChange={this.handleToggleNotifyOffice}
              />
            </React.Fragment>
          )}
        </Flex>
      </Flex>
    )
  }
}

export default connect(null)(CreateTask)
