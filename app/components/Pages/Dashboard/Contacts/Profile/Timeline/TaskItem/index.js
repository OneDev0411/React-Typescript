import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import { updateTask } from '../../../../../../../models/tasks/update-task'

import { Divider } from '../../../../../../../views/components/Divider'
import IconBell from '../../../../../../../views/components/SvgIcons/Bell/IconBell'
import { eventTypesIcons } from '../../../../../../../views/utils/event-types-icons'
// import { goTo } from '../../../../../../../utils/go-to'
import { getAssociations } from '../../../../../../../views/components/EventDrawer/helpers/get-associations'
import { AssociationItem } from '../../../../../../../views/components/AssocationItem'
import { getReminderLabel } from '../../../../../../../views/CRM/Tasks/components/NewTask/helpers/get-reminder-label'
import { Status } from './Status'
import { Container, Title, Description } from './styled'

export class CRMTaskItem extends React.Component {
  state = {
    disabled: false,
    associations: []
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
    try {
      this.setState({ disabled: true })

      const updatedEvent = {
        ...this.props.task,
        status: this.props.task.status === 'DONE' ? 'PENDING' : 'DONE'
      }

      this.props.editCallback(updatedEvent)

      await updateTask(updatedEvent)

      this.setState({ disabled: false })
    } catch (error) {
      console.log(error)
      this.setState({ disabled: false })
      throw error
    }
  }

  handleOnClick = () => {
    this.props.onClick(this.props.task)
  }

  render() {
    const { task } = this.props
    const { task_type, reminders } = task

    let iconColor = '#000'
    let Icon = eventTypesIcons.Other.icon

    if (eventTypesIcons[task_type]) {
      Icon = eventTypesIcons[task_type].icon

      if (eventTypesIcons[task_type].color) {
        iconColor = eventTypesIcons[task_type].color
      }
    }

    const showReminder =
      reminders &&
      reminders.length > 0 &&
      task.reminders[0].timestamp * 1000 > new Date().getTime()

    return (
      <Container>
        <Flex alignCenter style={{ marginBottom: '2em' }}>
          <Flex
            alignCenter
            onClick={this.handleOnClick}
            className="u-cursor--pointer"
          >
            <Icon style={{ marginRight: '0.5em', fill: iconColor }} />
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
            {showReminder && (
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
            checked={task.status === 'DONE'}
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
          {this.state.associations.map((association, index) => {
            if (
              association[association.association_type].id ===
              this.props.contact.id
            ) {
              return null
            }

            return (
              <AssociationItem
                association={association}
                key={`association_${index}`}
                isRemovable={false}
              />
            )
          })}
        </Flex>
      </Container>
    )
  }
}
