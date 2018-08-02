import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import Alert from '../../../../components/Pages/Dashboard/Partials/Alert'
import {
  createTouch,
  getTouch,
  updateTouch
} from '../../../../models/crm-touches'

import { TouchType } from './components/TouchType'
import { TouchDateTime } from './components/TouchDateTime'

import ActionButton from '../../../components/Button/ActionButton'
import LoadSaveReinitializeForm from '../../../utils/LoadSaveReinitializeForm'

import { postLoadFormat, preSaveFormat } from './helpers'
import { TextAreaField } from '../../../components/final-form-fields'

const propTypes = {
  defaultAssociations: PropTypes.arrayOf(PropTypes.shape()),
  submitCallback: PropTypes.func,
  touchId: PropTypes.string
}

const defaultProps = {
  defaultAssociations: [],
  submitCallback: () => {},
  touchId: ''
}

class Touch extends React.Component {
  load = async () => {
    if (!this.props.touchId) {
      return
    }

    try {
      const touch = await getTouch(this.props.touchId)

      return touch
    } catch (error) {
      throw error
    }
  }
  save = async touch => {
    let newTouch
    let action = 'added'

    try {
      if (touch.id) {
        newTouch = await updateTouch(touch)
        action = 'updated'
      } else {
        newTouch = await createTouch(touch)
      }

      this.props.dispatch(
        notify({
          status: 'success',
          message: `Touch ${action}.`
        })
      )

      this.props.submitCallback(newTouch)
    } catch (error) {
      throw error
    }
  }

  render() {
    return (
      <div className="c-touch-form">
        <LoadSaveReinitializeForm
          load={this.load}
          postLoadFormat={touch =>
            postLoadFormat(touch, this.props.defaultAssociations)
          }
          preSaveFormat={preSaveFormat}
          save={this.save}
        >
          {({ values, validating, submitting, handleSubmit, submitError }) => {
            let buttonText = this.props.touchId ? 'Save' : 'Add'

            if (submitting) {
              buttonText = this.props.touchId ? 'Saving' : 'Adding'
            }

            return (
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
                      {buttonText}
                    </ActionButton>
                  </div>
                </div>
              </form>
            )
          }}
        </LoadSaveReinitializeForm>
      </div>
    )
  }
}

Touch.propTypes = propTypes
Touch.defaultProps = defaultProps

export default connect()(Touch)
