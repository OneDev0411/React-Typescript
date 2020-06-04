import * as React from 'react'

import { Box, Container } from '@material-ui/core'

import { Helmet } from 'react-helmet'

import EditEmailSignature from 'components/EditEmailSignature'

interface Props {}

function EmailSignatureSettings(props: Props) {
  return (
    <>
      <Helmet>
        <title>Email Signature | Settings | Rechat</title>
      </Helmet>
      <Container maxWidth="md">
        <Box p={3}>
          <EditEmailSignature />
        </Box>
      </Container>
    </>
  )
}

export default EmailSignatureSettings
