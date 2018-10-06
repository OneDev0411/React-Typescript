import React from 'react'
import PropTypes from 'prop-types'

import { AddAssociation } from '../AddAssociation'
import { SearchContactDrawer } from '../SearchContactDrawer'
import Tooltip from '../tooltip'

import { normalizeContact } from '../../utils/association-normalizers'

export class AddContactAssociation extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    handleAdd: PropTypes.func.isRequired,
    buttonRenderer: PropTypes.func.isRequired
  }

  static defaultProps = {
    title: 'Attach Contact'
  }

  add = (contact, callback) =>
    this.props.handleAdd(normalizeContact(contact), callback)

  render() {
    const { title } = this.props

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              {this.props.buttonRenderer(handleOpen)}
            </Tooltip>
            <SearchContactDrawer
              title={title}
              isOpen={isActive}
              onClose={handleClose}
              onSelect={contact => this.add(contact, handleClose)}
            />
          </div>
        )}
      />
    )
  }
}
