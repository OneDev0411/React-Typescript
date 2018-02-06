import React from 'react'
import Dropdown from '../Dropdown'

const OPTIONS = {
  Mr: 'Mr',
  Ms: 'Ms',
  Mrs: 'Mrs',
  Miss: 'Miss',
  Dr: 'Dr'
}

export default function TitleDropDown(props) {
  return <Dropdown options={OPTIONS} {...props} />
}
