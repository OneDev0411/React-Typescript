import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../tooltip'
import { AddAssociation } from '../AddAssociation'
import SearchDealDrawer from '../SearchDealDrawer'
import { normalizeDeal } from '../../utils/association-normalizers'

export class AddDealAssociation extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    handleAdd: PropTypes.func.isRequired,
    buttonRenderer: PropTypes.func.isRequired
  }

  static defaultProps = {
    title: 'Attach Deal'
  }

  onSelectHandler = (deal, closeHandler) =>
    this.props.handleAdd(normalizeDeal(deal), closeHandler)

  render() {
    const { title } = this.props

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              {this.props.buttonRenderer(handleOpen)}
            </Tooltip>
            <SearchDealDrawer
              title={title}
              isOpen={isActive}
              onClose={handleClose}
              onSelect={deal => this.onSelectHandler(deal, handleClose)}
            />
          </div>
        )}
      />
    )
  }
}
