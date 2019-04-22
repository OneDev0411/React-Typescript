import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import ClickOutside from 'react-click-outside'

import { FormContainer } from './Form'
import { Container } from './styled'

class Role extends React.Component {
  handleDeleteRole = () => {}

  validate = values => {}

  onSubmit = values => {}

  get InitialValues() {
    return {}
  }

  render() {
    // console.log(this.props)

    if (this.props.isOpen === false) {
      return false
    }

    return (
      <Container>
        <Form
          validate={this.validate}
          onSubmit={this.onSubmit}
          initialValues={this.InitialValues}
          render={formProps => (
            <FormContainer
              {...formProps}
              onDeleteRole={this.handleDeleteRole}
              onClose={this.props.onClose}
            />
          )}
        />
      </Container>
    )
  }
}

Role.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

Role.defaultProps = {}

export default Role
