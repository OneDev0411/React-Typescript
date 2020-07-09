import React from 'react'
import { mdiMenuDown } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const AccordionTrigger = ({ onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`c-filters-status__accordion-trigger ${
      active ? 'is-active' : ''
    }`}
  >
    <SvgIcon
      size={muiIconSizes.large}
      className="c-filters-status__accordion-trigger__icon"
      path={mdiMenuDown}
    />
  </button>
)

export default AccordionTrigger
