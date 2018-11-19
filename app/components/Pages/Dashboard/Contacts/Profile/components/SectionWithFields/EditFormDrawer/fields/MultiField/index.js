import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import Flex from 'styled-flex-component'

import { borderColor } from 'views/utils/colors'
import { Dropdown } from 'components/Dropdown'
import { DateField } from 'components/final-form-fields/DateField'
import IconButton from 'components/Button/IconButton'
import AddIcon from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'
import RemoveIcon from 'components/SvgIcons/RemoveCircleOutline/IconRemoveCircleOutline'

import { PrimaryStar } from '../../../../../../components/PrimaryStar'
import { Container, Title } from '../styled'
import { TextField } from './TextField'

export class MultiField extends React.Component {
  static propTypes = {
    attribute: PropTypes.shape().isRequired,
    format: PropTypes.func,
    mutators: PropTypes.shape().isRequired,
    parse: PropTypes.func,
    placeholder: PropTypes.string,
    validate: PropTypes.func
  }

  static defaultProps = {
    placeholder: '',
    format: t => t,
    parse: t => t,
    validate: () => undefined
  }

  renderRightSide = field => {
    const { attribute_def } = this.props.attribute

    if (attribute_def.data_type === 'date') {
      return <DateField yearIsOptional name={field} />
    }

    return attribute_def.enum_values ? (
      <Field
        component={Dropdown}
        fullWidth
        items={attribute_def.enum_values.map(value => ({
          title: value,
          value
        }))}
        itemToString={({ title }) => title}
        name={`${field}.value`}
        style={{ width: '100%' }}
      />
    ) : (
      <Field
        component={TextField}
        id={field}
        format={this.props.format}
        name={`${field}.value`}
        parse={this.props.parse}
        placeholder={this.props.placeholder}
        readOnly={!attribute_def.editable}
        validate={this.props.validate}
      />
    )
  }

  addNewField = () => {
    const { attribute_def } = this.props.attribute

    const SELECT_INITIAL_STATE = {
      title: '-Select-',
      value: '-Select-'
    }

    const newAttribute = {
      attribute_def,
      id: undefined,
      [attribute_def.data_type]: ''
    }

    if (attribute_def.data_type === 'date') {
      return this.props.mutators.push(attribute_def.id, {
        attribute: newAttribute,
        label: SELECT_INITIAL_STATE,
        day: { title: 'Day', value: null },
        month: { title: 'Month', value: null },
        year: null
      })
    }

    const newMultiFieldWithoutLabel = {
      attribute: newAttribute,
      value: attribute_def.enum_values ? SELECT_INITIAL_STATE : ''
    }
    const newMultiField = {
      attribute: newAttribute,
      label: SELECT_INITIAL_STATE,
      value: attribute_def.enum_values ? SELECT_INITIAL_STATE : ''
    }

    if (attribute_def.labels) {
      this.props.mutators.push(attribute_def.id, newMultiField)
    } else {
      this.props.mutators.push(attribute_def.id, newMultiFieldWithoutLabel)
    }
  }

  render() {
    const { attribute_def, is_primary } = this.props.attribute
    const defaultOptions = attribute_def.labels
      ? attribute_def.labels.map(label => ({
          title: label,
          value: label
        }))
      : null

    return (
      <FieldArray name={attribute_def.id}>
        {({ fields }) =>
          fields.map((field, index) => (
            <div
              key={field}
              style={{
                width: '100%',
                display: 'flex'
              }}
            >
              <Container
                withoutLabel={!defaultOptions}
                style={{ width: '40%', paddingBottom: 0 }}
              >
                <Flex alignCenter>
                  <Title htmlFor={field}>{attribute_def.label}</Title>
                  {is_primary && <PrimaryStar />}
                </Flex>
                {defaultOptions && (
                  <Field
                    component={Dropdown}
                    style={{ marginLeft: '-1rem' }}
                    fullWidth
                    items={defaultOptions}
                    itemToString={({ title }) => title}
                    name={`${field}.label`}
                  />
                )}
              </Container>
              <div
                style={{
                  width: '60%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: attribute_def.enum_values
                    ? '0'
                    : '0.5rem 0 0.5rem 1rem',
                  borderWidth: '0 0 1px 1px',
                  borderStyle: 'solid',
                  borderColor
                }}
              >
                {this.renderRightSide(field)}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '1em',
                    height: attribute_def.enum_values ? '2.5rem' : 'auto'
                  }}
                >
                  {index + 1 === fields.length ? (
                    <IconButton
                      type="button"
                      isFit
                      iconSize="large"
                      onClick={this.addNewField}
                    >
                      <AddIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      isFit
                      type="button"
                      iconSize="large"
                      onClick={() => fields.remove(index)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </FieldArray>
    )
  }
}
