import React from 'react'
import PropTypes from 'prop-types'

import { AddAssociation } from '../AddAssociation'
import SelectContactModal from '../SelectContactModal'
import Tooltip from '../tooltip'

import { normalizeContact } from '../../utils/association-normalizers'

export class AddContactAssociation extends React.Component {
  static propTypes = {
    handleAdd: PropTypes.func.isRequired,
    buttonRenderer: PropTypes.func.isRequired
  }

  add = (contact, callback) =>
    this.props.handleAdd(normalizeContact(contact), callback)

  render() {
    const title = 'Attach Contact'

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              {this.props.buttonRenderer(handleOpen)}
            </Tooltip>
            <SelectContactModal
              title={title}
              isOpen={isActive}
              handleSelectedItem={contact => this.add(contact, handleClose)}
              handleOnClose={handleClose}
            />
          </div>
        )}
      />
    )
  }
}
