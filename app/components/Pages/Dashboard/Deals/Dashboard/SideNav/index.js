import React from 'react'

import FactsheetSection from '../Factsheet'
import Roles from '../../components/Roles'

import { SideColumnContainer, FactsheetDivider, Card } from '../styled'

export default function SideNav(props) {
  const { deal } = props

  return (
    <SideColumnContainer>
      <Card
        style={{
          padding: '1.5rem 0'
        }}
      >
        <FactsheetSection
          deal={deal}
          section="CriticalDates"
          title="Critical Dates"
        />

        <FactsheetDivider />

        <Roles deal={deal} />

        <FactsheetDivider />

        <FactsheetSection deal={deal} section="CDA" title="CDA Information" />

        <FactsheetDivider />

        <FactsheetSection
          deal={deal}
          section="Listing"
          title="Listing Information"
        />
      </Card>
    </SideColumnContainer>
  )
}
