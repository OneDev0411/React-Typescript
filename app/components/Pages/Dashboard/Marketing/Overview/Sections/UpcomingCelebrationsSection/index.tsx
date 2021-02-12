import React from 'react'

import LinkSectionAction from '../LinkSectionAction'

import SectionLayout from '../SectionLayout'

export default function UpcomingCelebrationsSection() {
  return (
    <SectionLayout
      title="Upcoming Celebrations"
      actionNode={
        <LinkSectionAction
          title="View all celebrations"
          url="/dashboard/calendar"
        />
      }
    >
      <h2>Celebrations</h2>
    </SectionLayout>
  )
}
