import React from 'react'

import { CheckBoxButton } from '../../../../Button/CheckboxButton'
import { CheckBoxButtonWithoutState } from '../../../../Button/CheckboxButton/CheckboxWithoutState'

const SESSION_KEY_PREFIX = 'Rechat--Grid--Selectable--'

export function resetGridSelectedItems(key) {
  console.log('[ Grids -> Selectable ] Reset Selected Items')
  window.gridSelectableStorage[`${SESSION_KEY_PREFIX}${key}`] = ''
}

export class SelectablePlugin {
  constructor({ options, onRequestForceUpdate }) {
    this.options = options
    this.onRequestForceUpdate = onRequestForceUpdate
    this.data = []

    if (options.persistent && !options.storageKey) {
      throw new Error(
        '[ Grids -> Selectable ] it should provide storage key on persistant mode'
      )
    }

    // create global storage if doesn't exists
    if (!window.gridSelectableStorage) {
      window.gridSelectableStorage = {}
    }

    if (!options.persistent) {
      this.StorageEngine = null
    }

    // callback previous selected rows
    if (options.persistent && this.SelectedRows.length > 0) {
      this.onChange()
    }
  }

  setData(data = []) {
    // set new data
    this.data = data
  }

  /**
   * reset all selected rows in persistent mode
   */
  resetSelectedItems = () => {
    console.log(
      `[ Grids -> Selectable -> ${this.StorageKey} ] Reset Selected Items`
    )

    window.gridSelectableStorage[this.StorageKey] = ''

    this.onChange()
  }

  /**
   * save object
   * @param {Object} object - data object
   */
  set StorageObject(object) {
    this.StorageEngine = JSON.stringify({
      ...this.StorageObject,
      ...object
    })
  }

  /**
   * returns json object of storage
   */
  get StorageObject() {
    return JSON.parse(this.StorageEngine) || {}
  }

  /**
   * returns whether a row is selected or not
   * @param { UUID } id - the row id
   */
  isRowSelected = id =>
    this.StorageObject.selectedRows && this.StorageObject.selectedRows[id]

  /**
   * returns true when at least one row is selected
   */
  anyRowSelected = () =>
    !this.isAllRowsSelected() &&
    this.StorageObject.selectedRows &&
    Object.keys(this.StorageObject.selectedRows).length > 0

  /**
   * checks whether all rows are selected or not
   */
  isAllRowsSelected = () => this.StorageObject.selectAllRows === true

  /**
   * returns storage key
   */
  get StorageKey() {
    return `${SESSION_KEY_PREFIX}${this.options.storageKey}`
  }

  /**
   * returns all selected rows
   */
  get SelectedRows() {
    return Object.keys(this.StorageObject.selectedRows || {})
  }

  /**
   * returns storage engine
   */
  get StorageEngine() {
    return window.gridSelectableStorage[this.StorageKey] || null
  }

  /**
   * store object into storage
   */
  set StorageEngine(data) {
    window.gridSelectableStorage[this.StorageKey] = data
  }

  /**
   * toggles selection status of a row
   * @param { UUID } id - the row id
   */
  toggleSelectRow = id => {
    if (!id) {
      console.error(
        '[ Grid -> Selectable ] Unique Id for this row is not provided'
      )

      return false
    }

    const { selectedRows = {} } = this.StorageObject

    if (selectedRows[id]) {
      delete selectedRows[id]

      // deselect select-all checkbox in header if is selected
      this.isAllRowsSelected() && this.toggleSelectAllRows()
    } else {
      selectedRows[id] = true
    }

    this.StorageObject = { selectedRows }

    this.onChange()
    this.onRequestForceUpdate()
  }

  /**
   * toggles selecting all rows
   */
  toggleSelectAllRows = () => {
    const selectedRows = {}
    const { selectAllRows = false } = this.StorageObject

    if (selectAllRows === false) {
      this.data.forEach(row => {
        selectedRows[row.id] = true
      })
    }

    this.StorageObject = {
      selectAllRows: !selectAllRows,
      selectedRows
    }

    this.onChange()
  }

  onChange = () => {
    if (!this.options.onChange) {
      this.onRequestForceUpdate()

      return
    }

    this.options.onChange(this.SelectedRows)
  }

  registerColumn = columns => {
    const column = {
      id: 'plugin--selectable',
      width: '24px',
      sortable: false,
      verticalAlign: 'center',
      header: () => (
        <CheckBoxButtonWithoutState
          someRowsSelected={this.anyRowSelected()}
          onClick={this.toggleSelectAllRows}
          isSelected={this.isAllRowsSelected() || this.anyRowSelected()}
        />
      ),
      render: ({ rowData: row }) => (
        <CheckBoxButton
          onClick={() => this.toggleSelectRow(row.id)}
          isSelected={this.isRowSelected(row.id)}
        />
      )
    }

    return [column, ...columns]
  }
}
