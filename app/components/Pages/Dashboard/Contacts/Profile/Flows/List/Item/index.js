import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import StopIcon from 'components/SvgIcons/CircleStop/IconCircleStop'

import { ItemContainer } from './styled'

Item.propTypes = {
  flow: PropTypes.shape().isRequired,
  onStop: PropTypes.func.isRequired
}

function Item({ flow, onStop }) {
  return (
    <ItemContainer>
      <Flex justifyBetween>
        <Flex style={{ width: 'calc(100% - 2.5rem)' }}>
          <Flex center className="status" />
          <div className="title">{flow.name}</div>
        </Flex>
        <Tooltip caption="Stop this Flow" size="small">
          <IconButton isFit inverse onClick={() => onStop(flow.id)}>
            <StopIcon />
          </IconButton>
        </Tooltip>
      </Flex>
    </ItemContainer>
  )
}

export default Item
