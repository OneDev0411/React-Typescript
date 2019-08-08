import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import Drawer from '../OverlayDrawer'
import ActionButton from '../Button/ActionButton'

export class FinalFormDrawer extends React.Component {
  static propTypes = {
    isSubmitDisabled: PropTypes.bool,
    initialValues: PropTypes.shape(),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    submitButtonLabel: PropTypes.string,
    submittingButtonLabel: PropTypes.string,
    showFooter: PropTypes.bool,
    closeDrawerOnBackdropClick: PropTypes.bool,
    disableSubmitByEnter: PropTypes.bool,
    validate: PropTypes.func,
    formId: PropTypes.string.isRequired,
    footerRenderer: PropTypes.func
  }

  static defaultProps = {
    isSubmitDisabled: false,
    initialValues: {},
    showFooter: true,
    disableSubmitByEnter: false,
    submitButtonLabel: 'Save',
    submittingButtonLabel: 'Saving ...',
    closeDrawerOnBackdropClick: false,
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

  onSubmit = async (values, form) => {
    const result = await this.props.onSubmit(values, form)

    if (result && result['FINAL_FORM/form-error']) {
      return result
    }

    form.initialize(this.props.initialValues)
  }

  handleKeyPress = e => {
    if (e.which == 13 && this.props.disableSubmitByEnter) {
      e.preventDefault()

      return false
    }

    return true
  }

  render() {
    const { isSubmitDisabled } = this.props

    return (
      <Form
        validate={this.props.validate}
        onSubmit={this.onSubmit}
        mutators={{ ...arrayMutators }}
        initialValues={this.props.initialValues}
        render={formProps => {
          const { submitting } = formProps

          return (
            <form
              id={this.props.formId}
              onSubmit={formProps.handleSubmit}
              onKeyPress={this.handleKeyPress}
            >
              <Drawer
                open={this.props.isOpen}
                onClose={e => this.handleOnClose(e, formProps)}
                closeOnBackdropClick={this.props.closeDrawerOnBackdropClick}
              >
                <Drawer.Header title={this.props.title} />
                <Drawer.Body>
                  {typeof this.props.render === 'function'
                    ? this.props.render(formProps)
                    : this.props.children}
                </Drawer.Body>

                {this.props.showFooter && (
                  <Drawer.Footer rowReverse>
                    {this.props.footerRenderer ? (
                      this.props.footerRenderer({
                        isSubmitDisabled,
                        formProps,
                        submitting,
                        handleSubmit: this.handleSubmit
                      })
                    ) : (
                      <ActionButton
                        type="submit"
                        isSubmitDisabled={
                          isSubmitDisabled || submitting || formProps.validating
                        }
                        onClick={this.handleSubmit}
                      >
                        {submitting
                          ? this.props.submittingButtonLabel
                          : this.props.submitButtonLabel}
                      </ActionButton>
                    )}
                  </Drawer.Footer>
                )}
              </Drawer>
            </form>
          )
        }}
      />
    )
  }
}
