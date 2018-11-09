import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'

import CsvParser from 'papaparse'
import _ from 'underscore'

import { compareTwoStrings } from '../../../../../../utils/dice-coefficient'
import { isAddressField } from '../helpers/address'

import FieldDropDown from '../FieldDropDown'
import FieldLabel from '../FieldLabel'
import CustomAttributeDrawer from '../../components/CustomAttributeDrawer'
import Loading from '../../../../../Partials/Loading'
import RadioButton from '../../../../../../views/components/RadioButton'

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
  state = {
    isCustomAttributeDrawerOpen: false,
    isAutoMapping: false
  }

  componentDidMount() {
    this.analyze()
  }

  selectedColumn = null

  analyze = () =>
    CsvParser.parse(this.props.file, {
      skipEmptyLines: true,
      trimHeaders: true,
      complete: results => this.onCsvParseComplete(results)
    })

  onCsvParseComplete = ({ data, errors }) => {
    const {
      updateCsvInfo,
      showMessageModal,
      updateWizardStep,
      setCurrentStepValidation,
      mappedFields
    } = this.props
    const colNames = data[0]
    const contacts = data
      .slice(1)
      .filter(columns => columns.join('').length > 0)

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

    const columns = this.analyzeColumns(colNames, contacts)

    batchActions([
      updateCsvInfo({
        errors,
        columns,
        rowsCount: contacts.length
      }),
      setCurrentStepValidation(true)
    ])

    if (_.size(mappedFields) === 0) {
      this.setState({
        isAutoMapping: true
      })

      setTimeout(() => {
        this.autoMap(columns)
      }, 100)
    }
  }

  autoMap = csvColoumns => {
    const { attributeDefs } = this.props
    const mappedFields = {}

    _.each(csvColoumns, ({ name: columnName }) => {
      let index = 0
      const attribute = this.findMatchedAttribute(columnName)

      if (!attribute) {
        return false
      }

      const isSingular = attributeDefs.byId[attribute.id]
      const isAddress = isAddressField(attributeDefs, attribute.id)

      // singular attrs can't be mapped more than once
      if (
        isSingular &&
        _.some(mappedFields, field => field.definitionId === attribute.id)
      ) {
        return false
      }

      if (isAddress) {
        index = _.filter(
          mappedFields,
          ({ definitionId }) => definitionId === attribute.id
        ).length
      }

      mappedFields[columnName] = {
        definitionId: attribute.id,
        index
      }
    })

    this.props.updateCsvInfo({
      mappedFields
    })

    this.setState({
      isAutoMapping: false
    })
  }

  /**
   * find most similar attribute for given csv column name
   * based on sorenson algorithm
   */
  findMatchedAttribute = csvColoumnName => {
    const { attributeDefs } = this.props
    const list = []

    _.some(attributeDefs.byId, definition => {
      const rate = compareTwoStrings(
        csvColoumnName.toLowerCase(),
        definition.label.toLowerCase()
      )

      list.push({
        id: definition.id,
        label: definition.label,
        rate
      })

      if (rate === 1) {
        return true
      }
    })

    if (list.length === 0) {
      return null
    }

    const bestMatches = _.sortBy(list, item => item.rate * -1)
    const bestMatch = bestMatches[0]

    if (bestMatch.rate > 0.32) {
      return bestMatch
    }

    return null
  }

  analyzeColumns = (columns, fields) => {
    const list = {}

    columns.forEach((name, index) => {
      const hasValue = fields.some(
        list => list[index] && list[index].length > 0
      )

      list[name] = {
        index,
        name,
        hasValue
      }
    })

    return list
  }

  toggleOpenDrawer = e => {
    const { field } = e ? e.target.dataset : {}

    if (field) {
      this.selectedColumn = field
    }

    this.setState(state => ({
      isCustomAttributeDrawerOpen: !state.isCustomAttributeDrawerOpen
    }))
  }

  shouldShowLabel = colName => this.getMappedField(colName).definition.has_label

  onChangeField = (fieldName, fieldValue) => {
    const { updateCsvFieldsMap } = this.props

    if (!fieldValue) {
      return updateCsvFieldsMap(fieldName, { definitionId: null, label: null })
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

  onNewCustomAttribute = attribute => {
    this.props.updateCsvFieldsMap(this.selectedColumn, {
      definitionId: attribute.id,
      label: null,
      index: 0
    })
  }

  handlePartner = (fieldName, is_partner) =>
    this.props.updateCsvFieldsMap(fieldName, {
      is_partner
    })

  render() {
    const { columns } = this.props

    if (this.state.isAutoMapping) {
      return (
        <div
          className="contact__import-csv--mapper"
          style={{ textAlign: 'center', fontWeight: 500, fontSize: '20px' }}
        >
          <Loading />
          Trying to map the columns automatically. please wait...
        </div>
      )
    }

    return (
      <div className="contact__import-csv--mapper">
        <div className="column-row heading">
          <div className="name">Columns Label From CSV</div>
          <div className="primary-partner">Contact Type</div>
          <div className="map-list">Rechat Property</div>
          <div className="map-label">Assign Label</div>
        </div>

        {columns &&
          _.chain(columns)
            .pick(({ hasValue }, colName) => hasValue && colName.length > 0)
            .map((info, colName) => {
              const mappedField = this.getMappedField(colName)

              const isPartner = mappedField.is_partner

              return (
                <div key={info.index} className="column-row">
                  <div className="name">{colName}</div>
                  <div className="primary-partner">
                    <RadioButton
                      selected={!isPartner}
                      title="Primary"
                      onClick={() => this.handlePartner(colName, false)}
                    />
                    <RadioButton
                      selected={isPartner}
                      title="Partner/Spouse"
                      onClick={() => this.handlePartner(colName, true)}
                    />
                  </div>
                  <div className="map-list">
                    <FieldDropDown
                      fieldName={colName}
                      selectedField={mappedField.definitionId}
                      selectedFieldIndex={mappedField.index}
                      toggleOpenDrawer={this.toggleOpenDrawer}
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

        <CustomAttributeDrawer
          isOpen={this.state.isCustomAttributeDrawerOpen}
          onClose={this.toggleOpenDrawer}
          submitCallback={this.onNewCustomAttribute}
        />
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

export default connect(
  mapStateToProps,
  {
    updateCsvFieldsMap,
    updateCsvInfo,
    updateWizardStep,
    showMessageModal,
    setCurrentStepValidation
  }
)(Mapper)
