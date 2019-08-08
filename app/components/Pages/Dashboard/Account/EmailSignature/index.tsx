import * as React from 'react'

import { Box, Container } from '@material-ui/core'

import { Helmet } from 'react-helmet'

import PageHeader from 'components/PageHeader'
import EditEmailSignature from 'components/EditEmailSignature'

interface Props {}

function EmailSignatureSettings(props: Props) {
  return (
    <>
      <Helmet>
        <title>Email Signature | Settings | Rechat</title>
      </Helmet>
      <PageHeader style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
        <PageHeader.Title showBackButton={false}>
          <PageHeader.Heading>Email Signature</PageHeader.Heading>
        </PageHeader.Title>
      </PageHeader>
      <Container maxWidth="md">
        <Box p={3}>
          <EditEmailSignature />
        </Box>
      </Container>
    </>
  )
}

export default EmailSignatureSettings
