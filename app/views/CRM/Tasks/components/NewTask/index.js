import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import { Field } from 'react-final-form'

import { createTask } from '../../../../../models/tasks/create-task'

import { EventDrawer } from '../../../../components/EventDrawer'
import ActionButton from '../../../../components/Button/ActionButton'
import { DateTimeField } from '../../../../components/final-form-fields/DateTimeField'

import LoadSaveReinitializeForm from '../../../../utils/LoadSaveReinitializeForm'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Title } from './components/Title'
import { Reminder } from './components/Reminder'
import { TaskType } from './components/TaskType'
import { AssociationsButtons } from './components/AssociationsButtons'
import { AssociationsList } from './components/AssociationsList'
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
      const query = 'associations[]=crm_task.reminders'
      const newTask = await createTask(task, query)

      return this.props.submitCallback(newTask)
    } catch (error) {
      throw error
    }
  }

  onClickMoreOptions = formValues => this.setState({ formValues })
  handleDrawerClose = formProps => {
    if (formProps && !formProps.preventDefault) {
      formProps.form.reset()
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
            const isActive =
              values.title ||
              (defaultAssociation
                ? values.associations.length > 1
                : values.associations.length > 0)

            return (
              <React.Fragment>
                <FormContainer onSubmit={props.handleSubmit}>
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
                          <Reminder dueDate={values.dueDate} />
                        </FieldContainer>
                      </Flex>
                      <AssociationsList
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
                          disabled={submitting || !values.title}
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
                    user={this.props.user}
                    initialValues={this.state.formValues}
                    onClose={this.handleDrawerClose}
                    submitCallback={() => this.handleDrawerClose(props)}
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
