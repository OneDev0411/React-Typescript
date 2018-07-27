import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Alert from '../../../components/Pages/Dashboard/Partials/Alert'
import { createTouch } from '../../../models/crm-touches/create-touch'

import { TouchType } from './components/TouchType'
import { TouchDateTime } from './components/TouchDateTime'

import ActionButton from '../../components/Button/ActionButton'
import LoadSaveReinitializeForm from '../../utils/LoadSaveReinitializeForm'

import { postLoadFormat, preSaveFormat, validate } from './helpers'
import { TextAreaField } from '../../components/final-form-fields'

class Touch extends React.Component {
  save = async touch => {
    try {
      await createTouch(touch)
      this.props.dispatch(
        notify({
          status: 'success',
          dismissAfter: 4000,
          message: 'Touch Added.'
        })
      )
    } catch (error) {
      throw error
    }
  }

  render() {
    return (
      <div className="c-touch-form">
        <LoadSaveReinitializeForm
          load={t => t}
          validate={validate}
          postLoadFormat={() => postLoadFormat(this.props.defaultAssociation)}
          preSaveFormat={preSaveFormat}
          save={this.save}
        >
          {({ values, validating, submitting, handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit} className="c-touch-form__form">
              <div className="c-touch-form__body">
                <TouchType />
                <TouchDateTime selectedDate={values.touchDate} />
                <TextAreaField label="Description" name="description" />
              </div>
              <div className="c-touch-form__footer">
                {submitError && (
                  <Alert
                    type="error"
                    style={{ textAlign: 'left', margin: '0 0 1em' }}
                  >
                    {submitError}
                  </Alert>
                )}
                <div>
                  <ActionButton
                    disabled={submitting || validating}
                    type="submit"
                  >
                    {submitting || validating ? 'Adding...' : 'Add'}
                  </ActionButton>
                </div>
              </div>
            </form>
          )}
        </LoadSaveReinitializeForm>
      </div>
    )
  }
}

export default connect()(Touch)
