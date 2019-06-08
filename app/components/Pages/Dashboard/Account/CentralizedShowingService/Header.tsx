import React from 'react'

import PageHeader from 'components/PageHeader'

export default function Header() {
  return (
    <>
      <PageHeader style={{ marginBottom: '3.5rem', marginTop: '1.5rem' }}>
        <PageHeader.Title
          title="Centralized Showing Service"
          showBackButton={false}
        />
      </PageHeader>
    </>
  )
}
