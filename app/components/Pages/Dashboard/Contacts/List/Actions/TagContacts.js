import React from 'react'

import { Button } from '@material-ui/core'

import { PopoverContactTagSelector } from 'components/TagSelector'

// import TagsOverlay from '../../components/TagsOverlay'

// <TagsOverlay
//           entireMode={this.props.entireMode}
//           totalContactsCount={this.props.totalRowsCount}
//           selectedContactsIds={this.props.selectedRows}
//           excludedContactsIds={this.props.excludedRows}
//           filters={this.props.filters}
//           searchText={this.props.searchText}
//           conditionOperator={this.props.conditionOperator}
//           users={this.props.users}
//           isOpen={this.state.overlayIsOpen}
//           closeOverlay={this.closeOverlay}
//           resetSelectedRows={this.props.resetSelectedRows}
//           handleChangeContactsAttributes={
//             this.props.handleChangeContactsAttributes
//           }
//         />
export const TagContacts = props => {
  return (
    <PopoverContactTagSelector
      anchorRenderer={onClick => (
        <Button
          disabled={props.disabled}
          variant="outlined"
          size="small"
          onClick={onClick}
        >
          Tag
        </Button>
      )}
      filter={{
        selectedIds: props.selectedRows,
        searchText: props.searchText,
        conditionOperator: props.conditionOperator
      }}
      callback={() => {
        props.resetSelectedRows()
        props.handleChangeContactsAttributes()
      }}
    />
  )
}
