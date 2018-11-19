import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { mergeContact } from 'models/contacts/merge-contact'
import { confirmation } from 'store_actions/confirmation'

import { Cell, Row } from 'components/Grid/Table/styled'
import ActionButton from 'components/Button/ActionButton'
import { borderColor } from 'views/utils/colors'

const GridRow = styled(Row)`
  background-color: #f8f8f8;
  border-bottom: 1px solid ${borderColor};
`

class DuplicateHeader extends React.Component {
  onMergeClick = () => {
    const {
      confirmation,
      setIsFetching,
      fetchContactDuplicate,
      header,
      refId,
      data,
      selected
    } = this.props

    let selectedRows = data
      .filter(({ id }) => selected.includes(id))
      .map(({ id }) => id)

    if (selectedRows.length === 0) {
      selectedRows = data.map(({ id }) => id)
    }

    confirmation({
      message: `Merge ${selectedRows.length + 1} Contacts?`,
      description:
        'The selected contacts will be merged into one contact.\n' +
        'Are you sure you want to continue?',
      confirmLabel: 'Yes, merge',
      onConfirm: async () => {
        setIsFetching(true)
        await mergeContact(header.id, selectedRows, {})

        await fetchContactDuplicate(header.id, refId)
      }
    })
  }

  render() {
    const { header, data, columns, mergeColumnWidth } = this.props

    return (
      <GridRow>
        <Cell width="24px" verticalAlign="center">
          {columns[0].subHeader(data)}
        </Cell>
        {columns
          .filter(
            ({ id }) => id !== 'merge-contact' && id !== 'plugin--selectable'
          )
          .map((column, colIndex) => (
            <Cell
              key={column.id || colIndex}
              width={`calc((100% - (24px + ${mergeColumnWidth})) / 4)`}
              verticalAlign={column.verticalAlign}
            >
              {column.render({
                rowData: header,
                subHeader: true
              })}
            </Cell>
          ))}
        <Cell width={mergeColumnWidth} verticalAlign="center">
          <ActionButton appearance="outline" onClick={this.onMergeClick}>
            Merge
          </ActionButton>
        </Cell>
      </GridRow>
    )
  }
}

export default connect(
  null,
  {
    mergeContact,
    confirmation
  }
)(DuplicateHeader)
