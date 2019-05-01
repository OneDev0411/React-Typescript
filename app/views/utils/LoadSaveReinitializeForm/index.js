import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import _ from 'underscore'

import { Spinner } from '../../../components/Partials/Loading'

const propTypes = {
  initialValues: PropTypes.shape(),
  load: PropTypes.func.isRequired,
  loading: PropTypes.node,
  postLoadFormat: PropTypes.func,
  preSaveFormat: PropTypes.func,
  save: PropTypes.func.isRequired
}

const defaultProps = {
  loading: <Spinner />,
  initialValues: {}
}

class LoadSaveReinitializeForm extends React.Component {
  state = {
    isLoading: false,
    originalValues: undefined,
    initialValues: this.props.initialValues
  }

  componentDidMount() {
    if (Object.keys(this.props.initialValues).length === 0) {
      this.load()
    }
  }

  load = async () => {
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

      this.setState({
        originalValues: valuesToSave,
        initialValues: postLoadFormat
          ? await postLoadFormat(valuesToSave.id ? valuesToSave : null)
          : valuesToSave
      })
    } catch (error) {
      console.error(error)

      return {
        [FORM_ERROR]:
          'Something is wrong in our system. We are sorry about this. Please connect to support for resolving it.'
      }
    }
  }

  render() {
    const {
      load,
      loading,
      postLoadFormat,
      preSaveFormat,
      save,
      ...rest
    } = this.props
    const { isLoading, initialValues } = this.state

    return isLoading || Object.keys(initialValues).length === 0 ? (
      loading
    ) : (
      <Form {...rest} initialValues={initialValues} onSubmit={this.save} />
    )
  }
}

LoadSaveReinitializeForm.propTypes = propTypes
LoadSaveReinitializeForm.defaultProps = defaultProps

export default LoadSaveReinitializeForm
