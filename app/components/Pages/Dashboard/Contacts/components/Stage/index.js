import React from 'react'
import Dropdown from '../Dropdown'

const OPTIONS = {
  Active: 'Active',
  General: 'General',
  PastClient: 'Past Client',
  QualifiedLead: 'Qualified Lead',
  UnqualifiedLead: 'Unqualified Lead'
}

export default function StageDropDown(props) {
  return <Dropdown options={OPTIONS} {...props} />
}
