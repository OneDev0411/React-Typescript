import React from 'react'
import { Helmet } from 'react-helmet'

import PageHeader from '../../../../../views/components/PageHeader'

const Payment = () => (
  <PageHeader isFlat style={{ marginBottom: '1.5em', marginTop: '1.5rem' }}>
    <Helmet>
      <title>Payment | Rechat</title>
    </Helmet>
    <PageHeader.Title showBackButton={false}>
      <PageHeader.Heading>Payment</PageHeader.Heading>
    </PageHeader.Title>
  </PageHeader>
)
export default Payment
