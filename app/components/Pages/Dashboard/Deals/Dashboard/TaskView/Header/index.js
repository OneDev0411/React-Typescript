import React from 'react'
import { connect } from 'react-redux'
import { mdiClose, mdiPencilOutline } from '@mdi/js'

import { updateTask } from 'actions/deals'

import Spinner from 'components/Spinner'
import IconButton from 'components/Button/IconButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { TaskStatus } from '../../Folders/Checklist/TaskRow/Status'

import { Container, Input, Toolbar, TitleContainer, Title } from './styled'

class Header extends React.Component {
  state = {
    showEditName: false,
    isSavingName: false
  }

  toggleEditName = () =>
    this.setState(state => ({
      showEditName: !state.showEditName
    }))

  handleSaveName = async () => {
    // todo
    const newValue = this.nameInput.value.trim()

    if (newValue.length === 0 && newValue === this.props.task.title) {
      return false
    }

    this.setState({
      showEditName: false,
      isSavingName: true
    })

    await this.props.updateTask(this.props.task.id, {
      title: newValue
    })

    this.setState({
      isSavingName: false
    })
  }

  onInputKeyPress = e => {
    if (e.which === 13) {
      this.handleSaveName()
    }
  }

  render() {
    if (!this.props.task) {
      return false
    }

    return (
      <Container>
        <Toolbar>
          <div>
            <TaskStatus
              deal={this.props.deal}
              task={this.props.task}
              isBackOffice={this.props.isBackOffice}
            />
          </div>

          <div>
            {this.state.isSavingName === false && (
              <IconButton
                isFit
                iconSize="large"
                inverse
                onClick={this.toggleEditName}
              >
                <SvgIcon path={mdiPencilOutline} />
              </IconButton>
            )}

            <IconButton
              isFit
              iconSize="large"
              inverse
              style={{
                marginLeft: '1.5rem'
              }}
              onClick={this.props.onClose}
            >
              <SvgIcon path={mdiClose} />
            </IconButton>
          </div>
        </Toolbar>

        <TitleContainer>
          {this.state.showEditName && (
            <Input
              autoFocus
              ref={ref => (this.nameInput = ref)}
              defaultValue={this.props.task.title}
              onBlur={this.handleSaveName}
              onKeyPress={this.onInputKeyPress}
            />
          )}

          {this.state.showEditName === false && !this.state.isSavingName && (
            <Title onDoubleClick={this.toggleEditName}>
              <TextMiddleTruncate
                text={this.props.task.title}
                maxLength={50}
                tooltipPlacement="bottom"
              />
            </Title>
          )}

          {this.state.isSavingName && <Spinner />}
        </TitleContainer>
      </Container>
    )
  }
}

export default connect(null, {
  updateTask
})(Header)
