import React from 'react'

import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import MakeVisibleToAdmin from '@app/components/Pages/Dashboard/Deals/Create/MakeVisibleToAdmin'
import IconButton from 'components/Button/IconButton'
import LinkButton from 'components/Button/LinkButton'
import RemoveIcon from 'components/SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

import { NotifyOffice } from '../NotifyOffice'

import { TextInput, Divider } from './styled'

class CreateTask extends React.Component {
  state = {
    isSaving: false,
    taskTitle: '',
    isMakeVisibleDialogOpen: false,
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
    if (this.state.notifyOffice && this.props.deal.is_draft) {
      this.setState({
        isMakeVisibleDialogOpen: true
      })

      return
    }

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

  onMakeVisibleComplete = () => {
    this.setState({
      isMakeVisibleDialogOpen: false
    })

    this.handleSave()
  }

  render() {
    const { props } = this

    return (
      <>
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
              <>
                <IconButton isFit iconSize="medium" onClick={props.onClose}>
                  <RemoveIcon />
                </IconButton>

                <Divider />

                <NotifyOffice
                  isSelected={this.state.notifyOffice}
                  checklist={props.checklist}
                  onChange={this.handleToggleNotifyOffice}
                />
              </>
            )}
          </Flex>
        </Flex>

        {this.state.isMakeVisibleDialogOpen && (
          <MakeVisibleToAdmin
            dealId={this.props.deal.id}
            onCancel={() =>
              this.setState({
                isMakeVisibleDialogOpen: false
              })
            }
            onComplete={this.onMakeVisibleComplete}
          />
        )}
      </>
    )
  }
}

export default connect(null)(CreateTask)
