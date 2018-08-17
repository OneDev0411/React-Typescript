import React from 'react'

import { CheckBoxButton } from './Checkbox'

const _externalStorageEngine = {}
const _storageInterface = {
  selectAllRows: false,
  selectedRows: {}
}

const getStorage = (empty = false) => {
  if (empty) {
    return Object.assign({}, _storageInterface, {
      selectAllRows: false,
      selectedRows: {}
    })
  }

  return _storageInterface
}

export function resetGridSelectedItems(key) {
  _externalStorageEngine[key] = getStorage(true)
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

    if (options.persistent) {
      _externalStorageEngine[this.StorageKey] = getStorage()
    } else {
      this.internalStorage = getStorage(true)
    }
  }

  setData(data = []) {
    // set new data
    this.data = data
  }

  /**
   * returns whether a row is selected or not
   * @param { UUID } id - the row id
   */
  isRowSelected = id => this.StorageEngine.selectedRows[id]

  /**
   * checks whether all rows are selected or not
   */
  isAllRowsSelected = () => this.StorageEngine.selectAllRows === true

  /**
   * returns storage key
   */
  get StorageKey() {
    return this.options.persistent ? this.options.storageKey : 0
  }

  /**
   * returns all selected rows
   */
  get SelectedRows() {
    return Object.keys(this.StorageEngine.selectedRows)
  }

  /**
   * returns storage engine
   */
  get StorageEngine() {
    return this.options.persistent
      ? _externalStorageEngine[this.StorageKey]
      : this.internalStorage
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

    if (this.StorageEngine.selectedRows[id]) {
      delete this.StorageEngine.selectedRows[id]
    } else {
      this.StorageEngine.selectedRows[id] = true
    }

    this.onChange()
    this.onRequestForceUpdate()
  }

  /**
   * toggles selecting all rows
   */
  toggleSelectAllRows = () => {
    const selectedRows = {}

    this.StorageEngine.selectAllRows = !this.StorageEngine.selectAllRows

    if (this.StorageEngine.selectAllRows) {
      this.data.forEach(row => {
        selectedRows[row.id] = true
      })
    }

    this.StorageEngine.selectedRows = selectedRows

    this.onChange()
  }

  onChange = () => {
    this.options.onChange(this.SelectedRows)
  }

  registerColumn = columns => {
    const column = {
      id: 'plugin--selectable',
      width: '40px',
      verticalAlign: 'center',
      header: () => (
        <CheckBoxButton
          onClick={this.toggleSelectAllRows}
          isSelected={this.isAllRowsSelected()}
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
