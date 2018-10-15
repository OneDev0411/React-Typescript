import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import Drawer from '../OverlayDrawer'
import ActionButton from '../Button/ActionButton'

export class FinalFormDrawer extends React.Component {
  static propTypes = {
    initialValues: PropTypes.shape(),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    submitButtonLabel: PropTypes.string,
    submittingButtonLabel: PropTypes.string,
    showFooter: PropTypes.bool,
    closeDrawerOnBackdropClick: PropTypes.bool,
    reinitializeAfterSubmit: PropTypes.bool,
    showReset: PropTypes.bool,
    showCancel: PropTypes.bool,
    validate: PropTypes.func,
    formId: PropTypes.string.isRequired
  }

  static defaultProps = {
    initialValues: {},
    showFooter: true,
    submitButtonLabel: 'Save',
    submittingButtonLabel: 'Saving ...',
    closeDrawerOnBackdropClick: true,
    reinitializeAfterSubmit: true,
    validate: () => ({})
  }

  handleOnClose = (e, formProps) => {
    const { form, submitting } = formProps

    if (submitting) {
      return
    }

    if (formProps.dirty) {
      form.initialize(this.props.initialValues)
    }

    this.props.onClose()
  }

  handleSubmit = () => {
    let event

    if (typeof Event === 'function') {
      event = new Event('submit', { cancelable: true })
    } else {
      event = document.createEvent('Event')

      event.initEvent('submit', true, true)
    }

    document.getElementById(this.props.formId).dispatchEvent(event)
  }

  render() {
    return (
      <Form
        validate={this.props.validate}
        onSubmit={this.props.onSubmit}
        mutators={{ ...arrayMutators }}
        initialValues={this.props.initialValues}
        render={formProps => {
          const { submitting } = formProps

          return (
            <form id={this.props.formId} onSubmit={formProps.handleSubmit}>
              <Drawer
                isOpen={this.props.isOpen}
                onClose={e => this.handleOnClose(e, formProps)}
                showFooter={this.props.showFooter}
                closeOnBackdropClick={this.props.closeDrawerOnBackdropClick}
              >
                <Drawer.Header title={this.props.title} />
                <Drawer.Body>
                  {typeof this.props.render === 'function'
                    ? this.props.render(formProps)
                    : this.props.children}
                </Drawer.Body>

                <Drawer.Footer rowReverse>
                  <ActionButton
                    type="submit"
                    disabled={submitting || formProps.validating}
                    onClick={this.handleSubmit}
                  >
                    {submitting
                      ? this.props.submittingButtonLabel
                      : this.props.submitButtonLabel}
                  </ActionButton>
                </Drawer.Footer>
              </Drawer>
            </form>
          )
        }}
      />
    )
  }
}
