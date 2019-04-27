import React, { Fragment } from 'react'
import styled from 'styled-components'

import TagsOverlay from '../../components/TagsOverlay'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import TagIcon from '../../../../../../views/components/SvgIcons/Tag/TagIcon'

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
    const {
      disabled,
      entireMode,
      totalRowsCount,
      excludedRows,
      selectedRows,
      filters,
      searchText,
      conditionOperator,
      users,
      resetSelectedRows,
      handleChangeContactsAttributes
    } = this.props
    const { overlayIsOpen } = this.state

    return (
      <Fragment>
        <ActionButton
          disabled={disabled}
          appearance="outline"
          size="small"
          onClick={this.openOverLay}
        >
          <Tag />
          Tag
        </ActionButton>

        <TagsOverlay
          entireMode={entireMode}
          totalContactsCount={totalRowsCount}
          selectedContactsIds={selectedRows}
          excludedContactsIds={excludedRows}
          filters={filters}
          searchText={searchText}
          conditionOperator={conditionOperator}
          users={users}
          isOpen={overlayIsOpen}
          closeOverlay={this.closeOverlay}
          resetSelectedRows={resetSelectedRows}
          handleChangeContactsAttributes={handleChangeContactsAttributes}
        />
      </Fragment>
    )
  }
}
