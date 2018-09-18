import React from 'react'
import cn from 'classnames'
import ToolTip from '../tooltip'
import IconSelectedRadio from '../SvgIcons/Radio/SelectedRadio/IconSelectedRadio'
import IconUnSelectedRadio from '../SvgIcons/Radio/UnSelectedRadio/IconUnSelectedRadio'
import Flex from 'styled-flex-component'

export default ({
  selected,
  title,
  tooltip = null,
  disabled = false,
  onClick = () => null,
  style = {}
}) => (
  <Flex justifyStart style={style} onClick={onClick}>
    <ToolTip caption={tooltip}>
      <Flex alignCenter>
        {selected ? <IconSelectedRadio /> : <IconUnSelectedRadio />}
        <span
          className={cn('radio-label', { disabled })}
          data-test="radio-label"
        >
          {title}
        </span>
      </Flex>
    </ToolTip>
  </Flex>
)
