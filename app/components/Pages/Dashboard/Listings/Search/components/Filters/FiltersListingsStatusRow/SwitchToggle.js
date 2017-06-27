import React from 'react'
import pure from 'recompose/pure'

const SwitchToggle = ({ name, checked, className }) =>
  <div className={`c-switch-toggle ${className}`}>
    <input id={`${name}_checkbox`} type="checkbox" defaultChecked={checked} />
    <label htmlFor={`${name}_checkbox`}><span /></label>
  </div>

export default pure(SwitchToggle)
