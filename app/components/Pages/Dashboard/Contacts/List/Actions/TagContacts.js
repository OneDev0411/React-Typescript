import React, { Fragment } from 'react'

import { Button } from '@material-ui/core'

import TagsOverlay from '../../components/TagsOverlay'

export default class TagContacts extends React.Component {
  state = {
    overlayIsOpen: false
  }

  openOverLay = () => this.setState({ overlayIsOpen: true })

  closeOverlay = () => this.setState({ overlayIsOpen: false })

  render() {
    return (
      <Fragment>
        <Button
          disabled={this.props.disabled}
          variant="outlined"
          size="small"
          onClick={this.openOverLay}
        >
          Tag
        </Button>

        <TagsOverlay
          entireMode={this.props.entireMode}
          totalContactsCount={this.props.totalRowsCount}
          selectedContactsIds={this.props.selectedRows}
          excludedContactsIds={this.props.excludedRows}
          filters={this.props.filters}
          searchText={this.props.searchText}
          conditionOperator={this.props.conditionOperator}
          users={this.props.users}
          isOpen={this.state.overlayIsOpen}
          closeOverlay={this.closeOverlay}
          resetSelectedRows={this.props.resetSelectedRows}
          handleChangeContactsAttributes={
            this.props.handleChangeContactsAttributes
          }
        />
      </Fragment>
    )
  }
}
