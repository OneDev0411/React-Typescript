import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../tooltip'
import Button from '../Button/IconButton'
import { AddAssociation } from '../AddAssociation'
import SelectDealModal from '../SelectDealModal'
import Icon from '../SvgIcons/Deals/IconDeal'
import { normalizeDeal } from '../../utils/association-normalizers'

export class AddDealAssociation extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    handleAdd: PropTypes.func.isRequired
  }

  onSelectHandler = (deal, closeHandler) =>
    this.props.handleAdd(normalizeDeal(deal), closeHandler)

  render() {
    const title = 'Attach Deal'

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              <Button
                isFit
                inverse
                type="button"
                iconSize="large"
                onClick={handleOpen}
                disabled={this.props.disabled}
              >
                <Icon />
              </Button>
            </Tooltip>
            <SelectDealModal
              isOpen={isActive}
              title={title}
              handleOnClose={handleClose}
              handleSelectedItem={deal =>
                this.onSelectHandler(deal, handleClose)
              }
            />
          </div>
        )}
      />
    )
  }
}
