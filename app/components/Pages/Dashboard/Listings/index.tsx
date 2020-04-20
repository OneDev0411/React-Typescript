import React, { ReactChildren } from 'react'
import { Helmet } from 'react-helmet'
import { Box } from '@material-ui/core'

function Listings(props: { children: ReactChildren }) {
  return (
    <>
      <Helmet>
        <title>Properties | Rechat</title>
      </Helmet>
      <Box px={5}>{props.children}</Box>
    </>
  )
}

export default Listings
