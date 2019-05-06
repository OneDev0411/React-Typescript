import React, { useRef } from 'react'

import ToolTip from 'components/tooltip'

import { calculateWordWrap } from '../../../../utils/word-wrap'

import { Container } from './styled'

export default function Context(props) {
  const container = useRef()

  const handleClick = () =>
    !props.isReadOnly &&
    props.onClick(container.current.getBoundingClientRect())

  const { appearance, rects, values, fontSize } = calculateWordWrap(
    props.annotations,
    props.value,
    {
      maxFontSize: props.maxFontSize
    }
  )

  return (
    <React.Fragment>
      {rects.map((rect, index) => (
        <ToolTip
          key={index}
          captionIsHTML
          isCustom={false}
          caption={props.tooltip}
          placement="bottom"
          multiline
        >
          <Container
            id={props.annotations[index].fieldName}
            fontName={appearance.font}
            fontSize={fontSize}
            bold={appearance.bold}
            color={appearance.color}
            rect={rect}
            ref={container}
            readOnly={props.isReadOnly}
            onClick={handleClick}
          >
            {values[index]}
          </Container>
        </ToolTip>
      ))}
    </React.Fragment>
  )
}
