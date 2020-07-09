import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

import { createTask } from 'models/tasks/create-task'

import { EventDrawer } from 'components/EventDrawer'
import ActionButton from 'components/Button/ActionButton'
import {
  AssociationsList,
  DateTimeField,
  ReminderField
} from 'components/final-form-fields'

import LoadSaveReinitializeForm from 'views/utils/LoadSaveReinitializeForm'

import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'

import { preSaveFormat } from './helpers/pre-save-format'

import { Title } from './components/Title'
import { TaskType } from './components/TaskType'
import { AssociationsButtons } from './components/AssociationsButtons'
import { FormContainer, FieldContainer } from './styled'

const propTypes = {
  defaultAssociation: PropTypes.shape(),
  submitCallback: PropTypes.func
}

const defaultProps = {
  submitCallback: t => t,
  defaultAssociation: null
}
export default class Task extends Component {
  state = {
    formValues: null
  }

  save = async task => {
    try {
      const newTask = await createTask(task, CRM_TASKS_QUERY)

      return this.props.submitCallback(newTask)
    } catch (error) {
      throw error
    }
  }

  onClickMoreOptions = formValues => this.setState({ formValues })

  handleDrawerClose = (formProps, newEvent) => {
    this.setState({ formValues: null }, () => {
      if (formProps && formProps.form && newEvent != null) {
        formProps.form.reset()
        this.props.submitCallback(newEvent)
      }
    })
  }

  loadFormat = async () => {
    const { user, defaultAssociation } = this.props
    const associations = defaultAssociation ? [defaultAssociation] : []

    return initialValueGenerator(user, associations)
  }

  render() {
    const { defaultAssociation } = this.props

    return (
      <div>
        <LoadSaveReinitializeForm
          needsReinitialize
          load={() => null}
          postLoadFormat={this.loadFormat}
          preSaveFormat={preSaveFormat}
          save={this.save}
          render={props => {
            const { values } = props

            const submitting = props.submitting || props.validating

            return (
              <React.Fragment>
                <FormContainer onSubmit={props.handleSubmit}>
                  <Flex
                    alignCenter
                    justifyBetween
                    style={{ marginBottom: '1em' }}
                  >
                    <TaskType />
                    <FieldContainer
                      justifyBetween
                      alignCenter
                      style={{
                        margin: '0 0 0 1em',
                        flex: 2
                      }}
                    >
                      <DateTimeField
                        name="dueDate"
                        selectedDate={values.dueDate}
                      />
                      <ReminderField dueDate={values.dueDate} />
                    </FieldContainer>
                  </Flex>
                  <Title />
                  <AssociationsList
                    name="associations"
                    associations={values.associations}
                    defaultAssociation={defaultAssociation}
                  />
                  <Flex justifyBetween alignCenter>
                    <AssociationsButtons disabled={submitting} />

                    <Flex justifyBetween alignCenter>
                      <ActionButton
                        type="button"
                        size="small"
                        appearance="link"
                        disabled={this.state.showDrawer}
                        onClick={() => this.onClickMoreOptions(values)}
                        style={{ fontWeight: 500 }}
                      >
                        More Options
                      </ActionButton>
                      <ActionButton
                        type="submit"
                        size="small"
                        disabled={submitting}
                        data-test="save-task"
                      >
                        {submitting ? 'Saving...' : 'Save'}
                      </ActionButton>
                    </Flex>
                  </Flex>
                </FormContainer>

                {this.state.formValues && (
                  <EventDrawer
                    isOpen
                    showDefaultAssociation
                    defaultAssociation={defaultAssociation}
                    initialValues={this.state.formValues}
                    onClose={this.handleDrawerClose}
                    submitCallback={newEvent =>
                      this.handleDrawerClose(props, newEvent)
                    }
                    user={this.props.user}
                  />
                )}
              </React.Fragment>
            )
          }}
        />
      </div>
    )
  }
}

Task.propTypes = propTypes
Task.defaultProps = defaultProps

// todo: final-form mutator
