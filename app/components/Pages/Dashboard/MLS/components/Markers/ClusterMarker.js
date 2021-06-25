import React from 'react'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withPropsOnChange from 'recompose/withPropsOnChange'
import { Motion, spring } from 'react-motion'

const ClusterMarker = ({
  text,
  onClickHandler,
  defaultMotionStyle,
  motionStyle
}) => (
  <Motion style={motionStyle} defaultStyle={defaultMotionStyle}>
    {({ scale }) => (
      <div
        className="cluster-marker"
        onClick={onClickHandler}
        style={{
          transform: `translate3D(0,0,0) scale(${scale}, ${scale})`
        }}
      >
        <div>{text}</div>
      </div>
    )}
  </Motion>
)

export default compose(
  defaultProps({
    text: '0',
    initialScale: 0.6,
    defaultScale: 1,
    hoveredScale: 1.15,
    hovered: false,
    stiffness: 320,
    damping: 7,
    precision: 0.001
  }),
  withPropsOnChange(
    ['initialScale'],
    ({ initialScale, defaultScale, $prerender }) => ({
      initialScale,
      defaultMotionStyle: { scale: $prerender ? defaultScale : initialScale }
    })
  ),
  withPropsOnChange(
    ['hovered'],
    ({ hovered, hoveredScale, defaultScale, stiffness, damping, precision }) => ({
      hovered,
      motionStyle: {
        scale: spring(hovered ? hoveredScale : defaultScale, {
          stiffness,
          damping,
          precision
        })
      }
    })
  )
)(ClusterMarker)
