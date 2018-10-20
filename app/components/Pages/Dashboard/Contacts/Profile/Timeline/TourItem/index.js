import React from 'react'

import { DirectionMap } from '../../../../../../../views/components/maps/DirectionMap'

import { MetaInfo } from '../components/MetaInfo'
import { Assignees } from '../components/Assignees'
import { GeneralInfo } from '../components/GeneralInfo'
import { Associations } from '../components/Associations'

import { CRMTaskItem } from '../CRMTaskItem'

export class TourItem extends React.Component {
  state = {
    locations: []
  }

  setAssociations = associations =>
    this.setState({
      locations: associations
        .filter(a => a.association_type === 'listing')
        .sort((a, b) => b.index - a.index)
        .map(a => a.listing.original.property.address.location)
    })

  render() {
    const { task } = this.props
    const { locations } = this.state

    return (
      <CRMTaskItem
        {...this.props}
        render={({ onEdit, statusHandler, disabled }) => (
          <React.Fragment>
            <MetaInfo task={task} onEdit={onEdit} />
            <Assignees task={task} />
            <GeneralInfo
              disabled={disabled}
              onEdit={onEdit}
              statusHandler={statusHandler}
              task={task}
            />
            {locations.length > 0 && (
              <div style={{ marginBottom: '0.5rem', height: '10rem' }}>
                <DirectionMap
                  id={`tour_${task.id.replace(/-/gi, '_')}_map`}
                  locations={locations}
                  options={{
                    zoomControl: false,
                    draggable: false
                  }}
                />
              </div>
            )}
            <Associations
              defaultAssociationId={this.props.defaultAssociationId}
              setAssociations={this.setAssociations}
              task={task}
            />
          </React.Fragment>
        )}
      />
    )
  }
}
