import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/IconButton'
import { AddAssociation } from '../AddAssociation'
import Icon from '../SvgIcons/Contacts/IconContacts'
import SelectContactModal from '../SelectContactModal'
import Tooltip from '../tooltip'

import { normalizeContact } from '../../utils/association-normalizers'

export class AddContactAssociation extends React.Component {
  static propTypes = {
    handleAdd: PropTypes.func.isRequired
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
              <Button isFit iconSize="large" inverse onClick={handleOpen}>
                <Icon />
              </Button>
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
