import React from 'react'
import PropTypes from 'prop-types'
import ClickOutSide from 'react-click-outside'

import Icon from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'
import Button from 'components/Button/TextIconButton'

import { Flow } from './Flow'

export class AddToFlow extends React.Component {
  static propTypes = {
    alignFrom: PropTypes.string,
    associations: PropTypes.shape({
      contacts: PropTypes.arrayOf([PropTypes.string.isRequired]),
      deals: PropTypes.arrayOf([PropTypes.string.isRequired])
    }).isRequired,
    callback: PropTypes.func,
    style: PropTypes.shape()
  }

  static defaultProps = {
    alignFrom: 'right',
    callback() {},
    style: {}
  }

  state = { isOpen: false }

  open = () => this.setState({ isOpen: true })

  close = () => this.setState({ isOpen: false })

  render() {
    return (
      <ClickOutSide onClickOutside={this.close}>
        <div style={{ position: 'relative', ...this.props.style }}>
          <Button
            text="Add to Flow"
            iconLeft={Icon}
            onClick={this.open}
            style={{ pointerEvents: this.state.isOpen ? 'none' : 'initial' }}
          />

          {this.state.isOpen && (
            <Flow
              alignFrom="right"
              associations={this.props.associations}
              callback={this.props.callback}
              handleClose={this.close}
            />
          )}
        </div>
      </ClickOutSide>
    )
  }
}
