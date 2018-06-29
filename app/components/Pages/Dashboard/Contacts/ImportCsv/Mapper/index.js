import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'

import CsvParser from 'papaparse'
import _ from 'underscore'

import FieldDropDown from '../FieldDropDown'
import FieldLabel from '../FieldLabel'

import {
  updateCsvFieldsMap,
  updateCsvInfo,
  updateWizardStep,
  setCurrentStepValidation
} from '../../../../../../store_actions/contacts'

import { CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE } from '../../../../../../constants/contacts'

import { selectDefinition } from '../../../../../../reducers/contacts/attributeDefs'

import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'

class Mapper extends React.Component {
  componentDidMount() {
    this.analyze()
  }

  analyze = () =>
    CsvParser.parse(this.props.file, {
      skipEmptyLines: true,
      complete: results => this.onCsvParseComplete(results)
    })

  onCsvParseComplete = ({ data, errors }) => {
    const {
      updateCsvInfo,
      showMessageModal,
      updateWizardStep,
      setCurrentStepValidation
    } = this.props
    const colNames = data[0]
    const contacts = data.slice(1)

    if (contacts.length === 0 || errors.length > 0) {
      return showMessageModal({
        message: errors.length > 0 ? 'Something Wrong' : 'No Contact',
        description:
          errors.length > 0
            ? errors[0].message
            : 'This file does not contain any contacts to upload',
        hideCancelButton: true,
        confirmLabel: 'Okay',
        onConfirm: () =>
          updateWizardStep(CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE)
      })
    }

    batchActions([
      updateCsvInfo({
        errors,
        columns: this.analyzeColumns(colNames, contacts),
        rowsCount: contacts.length
      }),
      setCurrentStepValidation(true)
    ])
  }

  analyzeColumns = (columns, fields) => {
    const list = {}

    columns.forEach((name, index) => {
      const hasValue = fields.some(
        list => list[index] && list[index].length > 0
      )

      list[name] = {
        index,
        hasValue
      }
    })

    return list
  }

  shouldShowLabel = colName => this.getMappedField(colName).definition.has_label

  onChangeField = (fieldName, fieldValue) => {
    const { updateCsvFieldsMap } = this.props

    if (!fieldValue) {
      return updateCsvFieldsMap(fieldName, { definitionId: null, label: 0 })
    }

    const [definitionId, index] = fieldValue.split(':')

    updateCsvFieldsMap(fieldName, {
      definitionId,
      index: parseInt(index, 10)
    })
  }

  onChangeLabel = (fieldName, label) =>
    this.props.updateCsvFieldsMap(fieldName, { label })

  getMappedField = name => {
    const { attributeDefs: defs, mappedFields } = this.props
    const field = mappedFields[name]
    let definition = {}

    if (field && field.definitionId) {
      definition = selectDefinition(defs, field.definitionId)
    }

    return {
      ...field,
      definition
    }
  }

  render() {
    const { columns } = this.props

    if (columns.length === 0) {
      return false
    }

    return (
      <div className="contact__import-csv--mapper">
        <div className="column-row heading">
          <div className="name">Columns Label From CSV</div>
          <div className="map-list">Rechat Property</div>
          <div className="map-label">Assign Label</div>
        </div>

        {_.chain(columns)
          .pick(({ hasValue }, colName) => hasValue && colName.length > 0)
          .map((info, colName) => {
            const mappedField = this.getMappedField(colName)

            return (
              <div key={info.index} className="column-row">
                <div className="name">{colName}</div>
                <div className="map-list">
                  <FieldDropDown
                    fieldName={colName}
                    selectedField={mappedField.definitionId}
                    selectedFieldIndex={mappedField.index}
                    onChange={this.onChangeField}
                  />
                </div>

                <div className="map-label">
                  {this.shouldShowLabel(colName) && (
                    <FieldLabel
                      fieldName={colName}
                      fieldValue={mappedField.label}
                      columnName={colName}
                      labels={mappedField.definition.labels}
                      onChange={this.onChangeLabel}
                    />
                  )}
                </div>
              </div>
            )
          })
          .value()}
      </div>
    )
  }
}

function mapStateToProps({ contacts }) {
  const { importCsv, attributeDefs } = contacts
  const { file, columns, mappedFields, isCurrentStepValid } = importCsv

  return {
    file,
    columns,
    mappedFields,
    attributeDefs,
    isCurrentStepValid
  }
}

export default connect(mapStateToProps, {
  updateCsvFieldsMap,
  updateCsvInfo,
  updateWizardStep,
  showMessageModal,
  setCurrentStepValidation
})(Mapper)
