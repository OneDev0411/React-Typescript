import React from 'react'
import { connect } from 'react-redux'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import { updateTask } from '../../../../../../../store_actions/tasks'

import { Divider } from '../../../../../../../views/components/Divider'
import IconBell from '../../../../../../../views/components/SvgIcons/Bell/IconBell'
import { eventTypesIcons } from '../../../../../../../views/utils/event-types-icons'
// import { goTo } from '../../../../../../../utils/go-to'
import { getAssociations } from '../../../../../../../views/CRM/Tasks/components/NewTask/helpers/get-associations'
import { AssociationItem } from '../../../../../../../views/CRM/Tasks/components/NewTask/components/AssocationItem'
import { getReminderLabel } from '../../../../../../../views/CRM/Tasks/components/NewTask/helpers/get-reminder-label'
import { Status } from './Status'
import { Container, Title, Description } from './styled'

class CRMTaskItem extends React.Component {
  state = {
    disabled: false,
    associations: [],
    isDone: this.props.task.status === 'DONE'
  }

  componentDidMount() {
    this.fetchAssociations()
  }

  fetchAssociations = async () => {
    try {
      const associations = await getAssociations(this.props.task)

      this.setState({ associations })
    } catch (error) {
      console.log(error)
    }
  }

  handleStatus = async () => {
    const updatedTask = {
      ...this.props.task,
      status: this.state.isDone ? 'PENDING' : 'DONE'
    }

    this.setState(state => ({
      disabled: true,
      isDone: !state.isDone
    }))

    try {
      await this.props.dispatch(updateTask(updatedTask))

      this.setState({ disabled: false })
    } catch (error) {
      console.log(error)
      this.setState(state => ({
        isDone: !state.isDone,
        disabled: false
      }))
      throw error
    }
  }

  handleOnClick = () => {
    this.props.onClick(this.props.task)
  }

  render() {
    const { task } = this.props
    const { task_type, reminders } = task
    const Icon = eventTypesIcons[task_type]
      ? eventTypesIcons[task_type].icon
      : eventTypesIcons.Other.icon

    return (
      <Container>
        <Flex alignCenter style={{ marginBottom: '2em' }}>
          <Flex
            alignCenter
            onClick={this.handleOnClick}
            className="u-cursor--pointer"
          >
            <Icon style={{ marginRight: '0.5em' }} />
            <span>{task_type}</span>
          </Flex>
          <Divider margin="0 1em" width="1px" height="16px" />
          <Flex alignCenter style={{ color: '#7f7f7f' }}>
            <div className="u-cursor--pointer" onClick={this.handleOnClick}>
              {fecha.format(
                new Date(task.due_date * 1000),
                'MMM D, YYYY hh:mm A'
              )}
            </div>
            {reminders &&
              reminders.length > 0 && (
                <Flex
                  alignCenter
                  style={{ marginLeft: '1em' }}
                  onClick={this.handleOnClick}
                  className="u-cursor--pointer"
                >
                  <IconBell style={{ fill: '#7f7f7f' }} />
                  <span>
                    {getReminderLabel(
                      task.due_date * 1000,
                      task.reminders[0].timestamp * 1000
                    )}
                  </span>
                </Flex>
              )}
          </Flex>
        </Flex>
        <Flex style={{ marginBottom: '2em' }}>
          <Status
            disabled={this.state.disabled}
            checked={this.state.isDone}
            onClick={this.handleStatus}
          />
          <Flex column style={{ width: 'calc(100% - 40px)' }}>
            <Title className="u-cursor--pointer" onClick={this.handleOnClick}>
              {task.title}
            </Title>
            {task.description && <Description>{task.description}</Description>}
          </Flex>
        </Flex>
        <Flex wrap>
          {this.state.associations.map(association => {
            const record = association[association.association_type]

            if (record.id === this.props.contact.id) {
              return null
            }

            return (
              <AssociationItem
                record={record}
                key={record.id || record.title}
                removable={false}
              />
            )
          })}
        </Flex>
      </Container>
    )
  }
}

export default connect()(CRMTaskItem)
