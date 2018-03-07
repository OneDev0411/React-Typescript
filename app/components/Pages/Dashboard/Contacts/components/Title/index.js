import React from 'react'
import Dropdown from '../Dropdown'

const OPTIONS = {
  default: {
    title: 'Mr'
  },
  ms: {
    title: 'Ms'
  },
  mrs: {
    title: 'Mrs'
  },
  miss: {
    title: 'Miss'
  },
  dr: {
    title: 'Dr'
  }
}

export default function TitleDropDown(props) {
  return <Dropdown name="user-titles" options={OPTIONS} {...props} />
}
