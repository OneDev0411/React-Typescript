import React, { Fragment } from 'react'
import TagsOverlay from '../../components/TagsOverlay'

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
        {selectedRows.length > 0 && (
          <div className="list--secondary-button">
            <button
              className="button c-button--shadow"
              onClick={this.openOverLay}
            >
              Tag
            </button>
          </div>
        )}
        <TagsOverlay
          selectedContactsIds={selectedRows}
          isOpen={overlayIsOpen}
          closeOverlay={this.closeOverlay}
        />
      </Fragment>
    )
  }
}
