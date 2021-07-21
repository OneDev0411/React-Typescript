import React from 'react'

import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { AssociationItem } from '../../../AssocationItem'
import { Map } from '../../../tour/Map'

function LocationComponent({ location }) {
  return (
    <Box mb={2.5}>
      <Box mb={1} height="12rem" borderRadius="4px" overflow="hidden">
        <Map
          id="tour-direction-map"
          listings={[location.listing.original]}
          showDirection={false}
        />
      </Box>
      <AssociationItem association={location} isRemovable={false} />
    </Box>
  )
}

export function Location(props) {
  return <Field {...props} name="location" component={LocationComponent} />
}

Location.propTypes = {
  location: PropTypes.shape().isRequired
}
