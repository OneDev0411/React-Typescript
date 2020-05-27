import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Map } from '../../../tour/Map'
import { AssociationItem } from '../../../AssocationItem'

function LocationComponent({ location }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ height: '12rem', marginBottom: '0.5rem' }}>
        <Map
          id="tour-direction-map"
          listings={[location.listing.original]}
          showDirection={false}
        />
      </div>
      <AssociationItem association={location} isRemovable={false} />
    </div>
  )
}

export function Location(props) {
  return <Field {...props} name="location" component={LocationComponent} />
}

Location.propTypes = {
  location: PropTypes.shape().isRequired
}
