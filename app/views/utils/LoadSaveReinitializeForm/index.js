import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import _ from 'underscore'

import Loading from 'components/LoadingContainer'

const propTypes = {
  initialValues: PropTypes.shape(),
  load: PropTypes.func.isRequired,
  loading: PropTypes.node,
  needsReinitialize: PropTypes.bool,
  postLoadFormat: PropTypes.func,
  preSaveFormat: PropTypes.func,
  render: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  validate: PropTypes.func
}

const defaultProps = {
  loading: <Loading />,
  initialValues: {},
  needsReinitialize: false,
  validate: () => {}
}

class LoadSaveReinitializeForm extends React.Component {
  state = {
    isLoading: false,
    originalValues: undefined,
    initialValues: this.props.initialValues
  }

  componentDidMount() {
    this.load()
  }

  load = async () => {
    if (Object.keys(this.props.initialValues).length > 0) {
      return this.props.load()
    }

    const { postLoadFormat } = this.props

    this.setState({ isLoading: true })

    const originalValues = await this.props.load()
    const initialValues = postLoadFormat
      ? await postLoadFormat(originalValues)
      : originalValues

    this.setState({
      isLoading: false,
      originalValues,
      initialValues
    })
  }

  save = async values => {
    try {
      const { postLoadFormat, preSaveFormat } = this.props
      let valuesToSave = preSaveFormat
        ? await preSaveFormat(values, this.state.originalValues)
        : values

      if (!valuesToSave || _.isEmpty(valuesToSave)) {
        return
      }

      await this.props.save(valuesToSave)

      // Reinitializing
      if (this.props.needsReinitialize) {
        this.setState({
          originalValues: valuesToSave,
          initialValues: postLoadFormat
            ? await postLoadFormat(valuesToSave.id ? valuesToSave : null)
            : valuesToSave
        })
      }
    } catch (error) {
      console.error(error)

      return {
        [FORM_ERROR]:
          'Something is wrong in our system. We are sorry about this. Please connect to support for resolving it.'
      }
    }
  }

  render() {
    const { props } = this
    const { loading } = props
    const { isLoading, initialValues } = this.state

    return isLoading || Object.keys(initialValues).length === 0 ? (
      loading
    ) : (
      <Form
        initialValues={initialValues}
        onSubmit={this.save}
        render={props.render}
        validate={props.validate}
      />
    )
  }
}

LoadSaveReinitializeForm.propTypes = propTypes
LoadSaveReinitializeForm.defaultProps = defaultProps

export default LoadSaveReinitializeForm
