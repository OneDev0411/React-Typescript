import React, { ReactChildren } from 'react'
import { Helmet } from 'react-helmet'
import { Box } from '@material-ui/core'

function Listings(props: { children: ReactChildren }) {
  // Layout is made with flex. For the big picture, checkout the sample:
  // https://codepen.io/mohsentaleb/pen/jOPeVBK
  return (
    <>
      <Helmet>
        <title>Properties | Rechat</title>
      </Helmet>
      <Box
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        height="100%"
      >
        {props.children}
      </Box>
    </>
  )
}

export default Listings
