import React, { useRef } from 'react'

import ToolTip from 'components/tooltip'

import { calculateWordWrap } from '../../../../utils/word-wrap'

export default function Context(props) {
  const container = useRef()

  const handleClick = index =>
    !props.isReadOnly &&
    props.onClick(container.current.getBoundingClientRect(), index)

  const { appearance, rects, values, fontSize } = calculateWordWrap(
    props.annotations,
    props.value,
    {
      maxFontSize: props.maxFontSize
    }
  )

  return (
    <React.Fragment>
      {rects.map((rect, index) => {
        const style = {
          fontSize: `${fontSize}px`,
          fontFamily: appearance.font,
          color: appearance.color,
          fontWeight: appearance.bold ? 'bold' : 'normal',
          position: 'absolute',
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          backgroundColor: props.readOnly ? 'transparent' : '#d2e5f2',
          cursor: props.readOnly ? 'auto' : 'pointer',
          lineHeight: 'normal'
        }

        return (
          <div
            key={index}
            id={props.annotations[index].fieldName}
            ref={container}
            style={style}
            readOnly={props.isReadOnly}
          >
            <div style={{ display: 'inline-block' }}>
              {props.type === 'role' && values[index] ? (
                values[index].split(',').map((value, index) => (
                  <ToolTip
                    key={index}
                    captionIsHTML
                    isCustom={false}
                    caption={value}
                    placement="bottom"
                    multiline
                  >
                    <span onClick={() => handleClick(index)}>{value}, </span>
                  </ToolTip>
                ))
              ) : (
                <span onClick={handleClick}>{values[index]}</span>
              )}
            </div>

            {props.children}
          </div>
        )
      })}
    </React.Fragment>
  )
}
