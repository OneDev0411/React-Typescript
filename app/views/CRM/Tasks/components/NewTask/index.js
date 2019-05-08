import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import { Field } from 'react-final-form'

import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

import { createTask } from 'models/tasks/create-task'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'

import { EventDrawer } from 'components/EventDrawer'
import ActionButton from 'components/Button/ActionButton'
import {
  AssociationsList,
  DateTimeField,
  ReminderField,
  WhenFieldChanges
} from 'components/final-form-fields'

import LoadSaveReinitializeForm from 'views/utils/LoadSaveReinitializeForm'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

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
    if (formProps && !formProps.preventDefault) {
      formProps.form.reset()
      this.props.submitCallback(newEvent)
    }

    this.setState({ formValues: null })
  }

  render() {
    const { defaultAssociation } = this.props

    return (
      <div>
        <LoadSaveReinitializeForm
          load={() => null}
          postLoadFormat={() =>
            postLoadFormat(this.props.user, defaultAssociation)
          }
          preSaveFormat={preSaveFormat}
          save={this.save}
          render={props => {
            const { values } = props

            const submitting = props.submitting || props.validating

            const hasTitle =
              typeof values.title === 'string' && values.title.trim()

            const isActive =
              hasTitle ||
              (defaultAssociation
                ? values.associations.length > 1
                : values.associations.length > 0)

            return (
              <React.Fragment>
                <FormContainer onSubmit={props.handleSubmit}>
                  <WhenFieldChanges
                    set="reminder"
                    watch="dueDate"
                    setter={onChange => {
                      const items = REMINDER_DROPDOWN_OPTIONS.filter(
                        ({ value }) =>
                          value == null ||
                          value <=
                            new Date(values.dueDate).getTime() -
                              new Date().getTime()
                      )

                      if (items.length === 0) {
                        return onChange(REMINDER_DROPDOWN_OPTIONS[0])
                      }

                      // 15 Minutes Before
                      if (items.some(item => item.value === '900000')) {
                        onChange(REMINDER_DROPDOWN_OPTIONS[3])
                      } else {
                        onChange(items[items.length - 1])
                      }
                    }}
                  />
                  <Title />
                  {isActive && (
                    <React.Fragment>
                      <Flex
                        alignCenter
                        justifyBetween
                        style={{ marginBottom: '1.5em' }}
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
                      <AssociationsList
                        name="associations"
                        associations={values.associations}
                        defaultAssociation={defaultAssociation}
                      />
                    </React.Fragment>
                  )}
                  <Flex justifyBetween alignCenter>
                    <Field
                      name="associations"
                      render={({ input }) => (
                        <AssociationsButtons
                          disabled={submitting}
                          associations={values.associations}
                          onClick={input.onChange}
                        />
                      )}
                    />
                    {isActive && (
                      <Flex justifyBetween alignCenter>
                        <ActionButton
                          type="button"
                          appearance="link"
                          disabled={this.state.showDrawer}
                          onClick={() => this.onClickMoreOptions(values)}
                          style={{ fontWeight: 500 }}
                        >
                          More Options
                        </ActionButton>
                        <ActionButton
                          type="submit"
                          disabled={submitting || !hasTitle}
                        >
                          {submitting ? 'Saving...' : 'Save'}
                        </ActionButton>
                      </Flex>
                    )}
                  </Flex>
                </FormContainer>

                {this.state.formValues && (
                  <EventDrawer
                    isOpen
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
