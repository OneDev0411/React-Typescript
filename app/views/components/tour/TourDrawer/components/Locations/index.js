import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { Map } from '../../../Map'
import { Location } from './Location'

class LocationsComponent extends React.Component {
  removeHandler = async location => {
    if (location.id) {
      await this.props.handleDelete(location)

      this.props.input.onChange(
        this.props.locations.filter(a => a.id !== location.id)
      )
    } else {
      this.props.input.onChange(
        this.props.locations.filter(l => l.listing.id !== location.listing.id)
      )
    }
  }

  render() {
    const { locations } = this.props

    return (
      <React.Fragment>
        <div style={{ height: '15rem', marginBottom: '1rem' }}>
          <Map
            id="tour-direction-map"
            listings={locations.map(l => l.listing)}
          />
        </div>

        {locations.map((location, index) => {
          if (!location || !location.association_type) {
            return null
          }

          return (
            <Location
              index={index}
              location={location}
              key={`location_${index}`}
              handleRemove={this.removeHandler}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

export function Locations(props) {
  return <Field {...props} name="locations" component={LocationsComponent} />
}

Locations.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape()),
  handleDelete: PropTypes.func.isRequired
}

Locations.defaultProps = {
  locations: []
}
