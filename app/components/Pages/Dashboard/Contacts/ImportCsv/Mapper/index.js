import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import FieldDropDown, { fields as contactFields } from '../FieldDropDown'
import FieldLabel from '../FieldLabel'
import CsvParser from 'papaparse'
import {
  updateCsvFieldsMap,
  updateCsvInfo,
  updateWizardStep,
  setCurrentStepValidation
} from '../../../../../../store_actions/contacts'
import { CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE } from '../../../../../../constants/contacts'
import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'

class Mapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEmptyColumns: false
    }
  }

  componentDidMount() {
    this.analyze()
  }

  analyze = () => {
    const { file } = this.props

    CsvParser.parse(file, {
      skipEmptyLines: true,
      complete: results => this.onCsvParseComplete(results)
    })
  }

  onCsvParseComplete = ({ data, meta, errors }) => {
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

    const columns = this.findEmptyColumns(colNames, contacts)

    updateCsvInfo({
      columns,
      meta,
      errors,
      rows: contacts
    })

    setCurrentStepValidation(true)
  }

  findEmptyColumns = (columns, fields) => {
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

  onChangeField = (fieldName, field) =>
    this.props.updateCsvFieldsMap(fieldName, { field })

  onChangeLabel = (fieldName, label) =>
    this.props.updateCsvFieldsMap(fieldName, { label })

  toggleShowEmptyColumns = () =>
    this.setState({
      showEmptyColumns: !this.state.showEmptyColumns
    })

  shouldShowLabel = name => {
    const fieldName = this.getMapValue(name, 'field')

    if (!fieldName) {
      return false
    }

    return contactFields.find(row => row.value === fieldName).hasLabel
  }

  getMapValue = (name, field) => {
    const { mappedFields } = this.props

    return mappedFields[name] && mappedFields[name][field]
  }

  render() {
    const { columns } = this.props
    const { showEmptyColumns } = this.state

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
          .pick(({ hasValue }, name) => hasValue && name.length > 0)
          .map((info, name) => (
            <div key={info.index} className="column-row">
              <div className="name">{name}</div>
              <div className="map-list">
                <FieldDropDown
                  fieldName={name}
                  value={this.getMapValue(name, 'field')}
                  onChange={this.onChangeField}
                />
              </div>

              <div className="map-label">
                {this.shouldShowLabel(name) && (
                  <FieldLabel
                    fieldName={name}
                    contactField={this.getMapValue(name, 'field')}
                    fieldValue={this.getMapValue(name, 'label')}
                    onChange={this.onChangeLabel}
                  />
                )}
              </div>
            </div>
          ))
          .value()}

        {showEmptyColumns &&
          _.chain(columns)
            .pick(({ hasValue }) => !hasValue)
            .map((info, name) => (
              <div key={info.index} className="column-row">
                <div className="name is-empty">{name}</div>
              </div>
            ))
            .value()}

        <div className="column-row heading">
          <div
            className="name show-empty-cta"
            onClick={this.toggleShowEmptyColumns}
          >
            {showEmptyColumns ? 'Hide' : 'Show'} Empty Columns
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ contacts }) {
  const { importCsv } = contacts
  const { file, columns, mappedFields, isCurrentStepValid } = importCsv

  return {
    file,
    mappedFields,
    columns,
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
