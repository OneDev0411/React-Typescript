import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import { Field } from 'react-final-form'

import { createTask } from '../../../../../models/tasks/create-task'

import ActionButton from '../../../../components/Button/ActionButton'
import { DateTimeField } from '../../../../components/final-form-fields/DateTimeField'

import LoadSaveReinitializeForm from '../../../../utils/LoadSaveReinitializeForm'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Title } from './components/Title'
import { Reminder } from './components/Reminder'
import { TaskType } from './components/TaskType'
import { AssociationsCTA } from './components/AssociationsCTA'
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
  save = async task => {
    try {
      const query = 'associations[]=crm_task.reminders'
      const newTask = await createTask(task, query)

      return this.props.submitCallback(newTask)
    } catch (error) {
      throw error
    }
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
                      <AssociationsCTA
                        disabled={submitting}
                        associations={values.associations}
                        onClick={input.onChange}
                      />
                    )}
                  />
                  {isActive && (
                    <Flex justifyBetween alignCenter>
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
            )
          }}
        />
      </div>
    )
  }
}

Task.propTypes = propTypes
Task.defaultProps = defaultProps
