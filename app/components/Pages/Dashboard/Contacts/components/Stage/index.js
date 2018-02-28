import React from 'react'
import Dropdown from '../Dropdown'
import PropTypes from 'prop-types'

const propTypes = {
  handleOnSelect: PropTypes.func.isRequired,
  defaultTitle: PropTypes.string.isRequired
}

const OPTIONS = {
  General: {
    title: 'General'
  },
  Active: {
    title: 'Active'
  },
  PastClient: {
    title: 'Past Client'
  },
  QualifiedLead: {
    title: 'Qualified Lead'
  },
  UnqualifiedLead: {
    title: 'Unqualified Lead'
  }
}

function StageDropDown({ handleOnSelect, defaultTitle }) {
  const handleParse = text => text.replace(' ', '')

  const { title } =
    (defaultTitle && OPTIONS[defaultTitle] && OPTIONS[defaultTitle]) ||
    OPTIONS.General

  return (
    <Dropdown
      name="stage"
      options={OPTIONS}
      defaultTitle={title}
      handleParse={handleParse}
      handleOnSelect={handleOnSelect}
    />
  )
}

StageDropDown.propTypes = propTypes

export default StageDropDown
