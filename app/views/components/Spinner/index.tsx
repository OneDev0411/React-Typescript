// Loading.js
import React, { HTMLProps } from 'react'

interface Props {
  size?: number
  style?: HTMLProps<HTMLElement>['style']
}

export default function Spinner(props: Props) {
  return (
    <div
      className={`sk-circle ${props.size ? `sk-circle--${props.size}` : ''}`}
      style={props.style}
    >
      <div className="sk-circle1 sk-child" />
      <div className="sk-circle2 sk-child" />
      <div className="sk-circle3 sk-child" />
      <div className="sk-circle4 sk-child" />
      <div className="sk-circle5 sk-child" />
      <div className="sk-circle6 sk-child" />
      <div className="sk-circle7 sk-child" />
      <div className="sk-circle8 sk-child" />
      <div className="sk-circle9 sk-child" />
      <div className="sk-circle10 sk-child" />
      <div className="sk-circle11 sk-child" />
      <div className="sk-circle12 sk-child" />
    </div>
  )
}
