import React, { Fragment } from 'react'
import styled from 'styled-components'

import TagsOverlay from '../../components/TagsOverlay'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import TextIconButton from '../../../../../../views/components/Button/TextIconButton'
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
    const { selectedRows, disabled } = this.props
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
          selectedContactsIds={selectedRows}
          isOpen={overlayIsOpen}
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
