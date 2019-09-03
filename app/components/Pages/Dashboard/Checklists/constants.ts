import { ComponentProps } from 'react'

import PageSideNav from 'components/PageSideNav'

import { propertyTypeToSideNavItem } from './helpers/property-type-to-sidenav-item'

export const sellingPropertyTypes = [
  'Commercial Sale',
  'New Home',
  'Lot / Land',
  'Resale',
  'Residential Lease'
]
export const buyingPropertyTypes = [
  'Commercial Sale',
  'Commercial Lease',
  'New Home',
  'Lot / Land',
  'Resale',
  'Residential Lease'
]
export const SECTIONS: ComponentProps<typeof PageSideNav>['sections'] = [
  {
    title: 'Listings',
    items: sellingPropertyTypes.map(propertyTypeToSideNavItem('Selling'))
  },
  {
    title: 'Offers',
    items: buyingPropertyTypes.map(propertyTypeToSideNavItem('Buying'))
  }
]
