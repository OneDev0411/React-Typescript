import React from 'react'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const SIZE = 2.5

const Marker = styled.div`
  position: absolute;
  width: ${SIZE}rem;
  height: ${SIZE}rem;
  left: -${SIZE / 2}rem;
  top: -${SIZE / 2}rem;
  cursor: pointer;
`

import Tooltip from 'components/tooltip'
import { primary } from 'views/utils/colors'
import Icon from 'components/SvgIcons/MapPinOn/IconMapPinOn'

class SearchPinComponent extends React.Component {
  static propTypes = {
    caption: PropTypes.string
  }

  static defaultProps = {}

  render() {
    const size = '2.5rem'

    return (
      <Marker key="center-pin-marker">
        <Tooltip caption={this.props.caption}>
          <Icon style={{ fill: primary, width: size, height: size }} />
        </Tooltip>
      </Marker>
    )
  }
}

export const SearchPin = onlyUpdateForKeys(['caption'])(SearchPinComponent)
