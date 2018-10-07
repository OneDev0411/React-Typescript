import React from 'react'
import Flex from 'styled-flex-component'

import getListing from '../../../../../../../models/listings/listing/get-listing'
import { SingleMarkerMap } from '../../../../../../../views/components/maps/SingleMarkerMap'

import { MetaInfo } from '../components/MetaInfo'
import { Assignees } from '../components/Assignees'
import { GeneralInfo } from '../components/GeneralInfo'
import { Associations } from '../components/Associations'

import { CRMTaskItem } from '../CRMTaskItem'
import { MapContainer, Image } from './styled'

export class OpenHouseItem extends React.Component {
  state = {
    listing: null
  }

  componentDidMount() {
    this.fetchListing()
  }

  fetchListing = async () => {
    try {
      const listing = await getListing(this.props.task.listings[0])

      this.setState({ listing })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { task } = this.props
    const { listing } = this.state
    const listingCoverImage = listing && listing.cover_image_url

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
            {listing && (
              <Flex style={{ marginBottom: '1rem' }}>
                <MapContainer hasCoverImage={listingCoverImage}>
                  <SingleMarkerMap
                    id={`OH_${task.id.replace(/-/gi, '_')}_map`}
                    location={listing.property.address.location}
                    options={{
                      zoomControl: false,
                      draggable: false
                    }}
                  />
                </MapContainer>
                {listingCoverImage && <Image image={listingCoverImage} />}
              </Flex>
            )}
            <Associations
              task={task}
              user={this.props.user}
              contact={this.props.contact}
            />
          </React.Fragment>
        )}
      />
    )
  }
}
