import React, { Fragment } from 'react'
import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import TagIcon from 'components/SvgIcons/Tag/TagIcon'

import TagsOverlay from '../../components/TagsOverlay'

const Tag = styled(TagIcon)`
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

export default class TagContacts extends React.Component {
  state = {
    overlayIsOpen: false
  }

  openOverLay = () => this.setState({ overlayIsOpen: true })

  closeOverlay = () => this.setState({ overlayIsOpen: false })

  render() {
    return (
      <Fragment>
        <ActionButton
          disabled={this.props.disabled}
          appearance="outline"
          size="small"
          onClick={this.openOverLay}
        >
          <Tag />
          Tag
        </ActionButton>

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
