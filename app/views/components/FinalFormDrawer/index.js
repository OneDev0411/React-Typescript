import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import Drawer from '../OverlayDrawer'
import ActionButton from '../Button/ActionButton'

FinalFormDrawer.propTypes = {
  initialValues: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  showFooter: PropTypes.bool,
  showReset: PropTypes.bool,
  validate: PropTypes.func
}

FinalFormDrawer.defaultProps = {
  showReset: true,
  showFooter: true,
  validate: () => ({})
}

export function FinalFormDrawer(props) {
  const { submitting } = props

  return (
    <Form
      validate={props.validate}
      onSubmit={props.onSubmit}
      mutators={{ ...arrayMutators }}
      initialValues={props.initialValues}
      render={formProps => {
        const { form, pristine, validating, handleSubmit } = formProps

        return (
          <Drawer
            isOpen={props.isOpen}
            onClose={props.onClose}
            showFooter={props.showFooter}
          >
            <Drawer.Header title={props.title} />
            <Drawer.Body>
              {(typeof props.render === 'function' &&
                props.render(formProps)) ||
                props.children}
            </Drawer.Body>

            <Drawer.Footer>
              <div style={{ textAlign: 'left' }}>
                <ActionButton
                  disabled={submitting}
                  inverse
                  onClick={props.onClose}
                  type="button"
                >
                  Cancel
                </ActionButton>
              </div>
              <div style={{ textAlign: 'right' }}>
                {props.showReset && (
                  <ActionButton
                    type="button"
                    onClick={() => form.reset(props.initialValues)}
                    style={{ marginRight: '1em' }}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </ActionButton>
                )}
                <ActionButton
                  type="button"
                  disabled={submitting || validating}
                  onClick={() => handleSubmit(props.onSubmit)}
                >
                  {submitting ? 'Saving ...' : 'Save'}
                </ActionButton>
              </div>
            </Drawer.Footer>
          </Drawer>
        )
      }}
    />
  )
}
