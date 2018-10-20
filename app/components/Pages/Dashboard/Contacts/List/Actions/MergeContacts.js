import React from 'react'
import { connect } from 'react-redux'
import { mergeContact } from '../../../../../../store_actions/contacts'
import { confirmation } from '../../../../../../store_actions/confirmation'
import IconButton from '../../../../../../views/components/Button/IconButton'
import IconMerge from '../../../../../../views/components/SvgIcons/Merge/IconMerge'
import Tooltip from '../../../../../../views/components/tooltip'

class MergeContacts extends React.Component {
  onClick = () => {
    const { selectedRows, confirmation } = this.props

    confirmation({
      message: 'Merge contacts?',
      description:
        'The selected contacts will be merged into the 1st contact you selected. Once merged, it can not be undone. Are you sure you want to continue?',
      confirmLabel: 'Yes, merge',
      onConfirm: async () => {
        this.props.rowsUpdating(true)
        await this.props.mergeContact(selectedRows[0], selectedRows.slice(1))
        this.props.rowsUpdating(false)
        this.props.resetSelectedRows()
      }
    })
  }
  render() {
    return (
      <Tooltip placement="bottom" caption="Merge">
        <IconButton size="small" appearance="outline" onClick={this.onClick}>
          <IconMerge />
        </IconButton>
      </Tooltip>
    )
  }
}

export default connect(
  null,
  {
    mergeContact,
    confirmation
  }
)(MergeContacts)
