import React from 'react'

import { Container } from './styled'

import BasicTable from './Tables/Basic'
import MultipleTable from './Tables/Multiple'

class Grid extends React.Component {
  /**
   * calculate width of every cell
   */
  get RowsSize() {
    const { columns } = this.props

    const flexibleCellsCount = columns.filter(col => !col.width).length

    if (flexibleCellsCount === columns.length) {
      return columns.map(() => `${100 / columns.length}%`)
    }

    const calc = columns
      .filter(col => col.width)
      .map(col => col.width)
      .join(' + ')

    return columns.map(
      col => col.width || `calc((100% - (${calc})) / ${flexibleCellsCount})`
    )
  }

  render() {
    const { multiple, onTableRef } = this.props
    const sizes = this.RowsSize

    if (multiple) {
      return (
        <Container>
          <MultipleTable
            {...this.props}
            sizes={sizes}
            onTableRef={onTableRef}
          />
        </Container>
      )
    }

    return (
      <Container>
        <BasicTable {...this.props} sizes={sizes} />
      </Container>
    )
  }
}

export default Grid
