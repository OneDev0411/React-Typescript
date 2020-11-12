import React, { ComponentProps } from 'react'
import { Story, Meta } from '@storybook/react'

import ListingCard from 'components/ListingCards/ListingCard'
import { listing } from 'fixtures/listing/listing'
import { compactListing } from 'fixtures/listing/compact_listing'

export default {
  title: 'Listings/ListingCard',
  component: ListingCard,
  argTypes: {
    onClick: { action: 'clicked' },
    onToggleSelection: { action: 'selection toggle clicked' }
  }
} as Meta

const Template: Story<ComponentProps<typeof ListingCard>> = args => (
  <ListingCard {...args} />
)

export const Listing = Template.bind({})

Listing.args = {
  listing
}

export const CompactListing = Template.bind({})

CompactListing.args = {
  listing: compactListing
}

export const Bare = Template.bind({})

Bare.args = {
  listing,
  variant: 'bare'
}

export const LeaseProperty = Template.bind({})

LeaseProperty.args = {
  listing: {
    ...listing,
    property: {
      ...listing.property,
      property_subtype: 'LSE-House'
    }
  }
}

export const SingleImage = Template.bind({})

SingleImage.args = {
  listing: {
    ...listing,
    gallery_image_urls: [listing.gallery_image_urls![0]]
  }
}

export const WithSelection = Template.bind({})

WithSelection.args = {
  listing,
  selected: true
}
