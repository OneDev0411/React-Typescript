import React from 'react'
import { connect } from 'react-redux'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import { updateTask } from '../../../../../../../store_actions/tasks'

import { Divider } from '../../../../../../../views/components/Divider'
import IconBell from '../../../../../../../views/components/SvgIcons/Bell/IconBell'
import { icons } from '../../../../../../../views/CRM/Tasks/List/Table/columns/Type/icons'
// import { goTo } from '../../../../../../../utils/go-to'
import { getAssociations } from '../../../../../../../views/CRM/Tasks/components/NewTask/helpers/get-associations'
import { AssociationItem } from '../../../../../../../views/CRM/Tasks/components/NewTask/components/AssocationItem'
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

  // onClick = () =>
  //   goTo(
  //     `/crm/tasks/${this.props.task.id}`,
  //     `Contact - ${this.props.contact.display_name}`
  //   )

  render() {
    const { task } = this.props
    const { task_type } = task
    const Icon = icons[task_type] ? icons[task_type].icon : icons.Todo

    return (
      <Container>
        <Flex alignCenter style={{ marginBottom: '2em' }}>
          <Icon style={{ marginRight: '0.5em' }} />
          <div>{task_type}</div>
          <Divider margin="0 1em" width="1px" height="16px" />
          <Flex alignCenter style={{ color: '#7f7f7f' }}>
            <div>
              {fecha.format(
                new Date(task.due_date * 1000),
                'MMM D, YYYY hh:mm A'
              )}
            </div>
            {task.reminders &&
              task.reminders.length > 0 && (
                <Flex alignCenter style={{ marginLeft: '1em' }}>
                  <IconBell style={{ fill: '#7f7f7f' }} />
                  <span>
                    {fecha.format(
                      new Date(task.reminders[0].timestamp * 1000),
                      'mm:dd:YYYY hh:mm A'
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
            <Title>{task.title}</Title>
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
