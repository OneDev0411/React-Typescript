import React from 'react'

import { Container, Header, HeaderRow, HeaderCell } from './styled'

import BasicTable from './Tables/Basic'
import NestedTable from './Tables/Nested'

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

  /**
   * decides to render which kind of tables
   */
  renderTable = sizes => {
    const { nested, onRef } = this.props

    if (nested) {
      return <NestedTable {...this.props} sizes={sizes} onRef={onRef} />
    }

    return <BasicTable {...this.props} />
  }

  render() {
    const { columns } = this.props
    const sizes = this.RowsSize

    return (
      <Container>
        <Header>
          <HeaderRow>
            {columns &&
              columns.map((item, index) => (
                <HeaderCell key={item.id || index} width={sizes[index]}>
                  {item.header}
                </HeaderCell>
              ))}
          </HeaderRow>
        </Header>

        {this.renderTable(sizes)}
      </Container>
    )
  }
}

export default Grid
