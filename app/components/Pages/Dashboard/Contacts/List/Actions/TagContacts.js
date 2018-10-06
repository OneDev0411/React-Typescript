import React, { Fragment } from 'react'
import TagsOverlay from '../../components/TagsOverlay'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import TextIconButton from '../../../../../../views/components/Button/TextIconButton'
import TagIcon from '../../../../../../views/components/SvgIcons/Tag/TagIcon'

export default class TagContacts extends React.Component {
  state = {
    overlayIsOpen: false
  }

  openOverLay = () => this.setState({ overlayIsOpen: true })
  closeOverlay = () => this.setState({ overlayIsOpen: false })

  render() {
    const { selectedRows } = this.props
    const { overlayIsOpen } = this.state

    return (
      <Fragment>
        <TextIconButton
          appearance="outline"
          iconLeft={TagIcon}
          onClick={this.openOverLay}
          text="Tag"
          size="small"
        />

        <TagsOverlay
          selectedContactsIds={selectedRows}
          isOpen={overlayIsOpen}
          closeOverlay={this.closeOverlay}
          resetSelectedRows={this.props.resetSelectedRows}
        />
      </Fragment>
    )
  }
}
