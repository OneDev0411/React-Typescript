import React from 'react'

import FactsheetSection from '../../../Factsheet'
import Roles from '../../../../components/Roles'

import { Card } from './styled'
import { FactsheetDivider } from '../../../Factsheet/styled'

export default function SideNav(props) {
  const { deal, isBackOffice } = props

  return (
    <Card
      style={{
        padding: '1.5rem 0'
      }}
    >
      <FactsheetSection
        showDevider
        deal={deal}
        isBackOffice={isBackOffice}
        section="CriticalDates"
        title="Critical Dates"
      />

      <Roles deal={deal} />
      <FactsheetDivider />

      <FactsheetSection
        showDevider
        deal={deal}
        isBackOffice={isBackOffice}
        section="CDA"
        title="CDA Information"
      />

      <FactsheetSection
        deal={deal}
        isBackOffice={isBackOffice}
        section="Listing"
        title="Listing Information"
      />
    </Card>
  )
}
