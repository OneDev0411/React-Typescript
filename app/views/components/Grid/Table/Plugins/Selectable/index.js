export * from './Checkbox'

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
  constructor({ options, onChange }) {
    this.options = options
    this.onChange = onChange

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

    this.onChange({
      forceUpdate: false,
      selectAllRows: this.StorageEngine.selectAllRows,
      selectedRows: Object.keys(this.StorageEngine.selectedRows) || []
    })
  }

  /**
   * toggles selecting all rows
   */
  toggleSelectAllRows = () => {
    this.StorageEngine.selectAllRows = !this.StorageEngine.selectAllRows
    this.StorageEngine.selectedRows = {}

    this.onChange({
      forceUpdate: true,
      selectedRows: [],
      selectAllRows: this.StorageEngine.selectAllRows
    })
  }
}
