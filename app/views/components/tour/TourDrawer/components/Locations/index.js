import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Box } from '@material-ui/core'

import { Map } from '../../../Map'
import { Location } from './Location'

function LocationsComponent({ locations, input: { onChange } }) {
  const removeHandler = location => {
    onChange(locations.filter(l => l.listing.id !== location.listing.id))
  }

  const onDragEnd = result => {
    const moveArrayItem = (array, source, destination) => {
      const newArray = array.slice()

      newArray.splice(destination, 0, newArray.splice(source, 1)[0])

      return newArray
    }

    onChange(
      moveArrayItem(locations, result.source.index, result.destination.index)
    )
  }

  return (
    <>
      <Box height="12rem" borderRadius="4px" overflow="hidden">
        <Map
          id="tour-direction-map"
          listings={locations.map(l => l.listing.original)}
        />
      </Box>
      {(locations || []).length >= 1 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="locations-droppable">
            {droppableProvided => (
              <Box
                mt={1}
                zIndex={1}
                position="relative"
                ref={droppableProvided.innerRef}
              >
                {locations.map((location, index) => {
                  if (!location || !location.association_type) {
                    return null
                  }

                  return (
                    <Location
                      index={index}
                      location={location}
                      key={`location_${index}`}
                      handleRemove={removeHandler}
                    />
                  )
                })}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  )
}

Locations.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape()),
  handleDelete: PropTypes.func.isRequired
}

Locations.defaultProps = {
  locations: []
}

export function Locations(props) {
  return <Field {...props} name="locations" component={LocationsComponent} />
}
