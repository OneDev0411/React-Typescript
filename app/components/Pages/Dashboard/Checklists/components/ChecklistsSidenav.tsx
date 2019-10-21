import React from 'react'

import { Typography } from '@material-ui/core'

import SideNavItem from 'components/PageSideNav/SideNavItem'

import SideNavTitle from 'components/PageSideNav/SideNavTitle'

import SideNavSection from '../../../../../views/components/PageSideNav/SideNavSection'
import PageSideNav from '../../../../../views/components/PageSideNav'
import { buyingPropertyTypes, sellingPropertyTypes } from '../constants'
import { getChecklistPageLink } from '../helpers/get-checklist-page-link'

export function ChecklistsSidenav() {
  return (
    <>
      <PageSideNav width="13rem" isOpen>
        <Typography variant="subtitle1">Checklists</Typography>
        <SideNavSection>
          <SideNavTitle>Listings</SideNavTitle>
          {sellingPropertyTypes.map(propertyType => (
            <SideNavItem
              key={propertyType}
              title={propertyType}
              link={getChecklistPageLink(propertyType, 'Selling')}
            />
          ))}
        </SideNavSection>
        <SideNavSection>
          <SideNavTitle>Contract</SideNavTitle>
          {buyingPropertyTypes.map(propertyType => (
            <SideNavItem
              key={propertyType}
              title={propertyType}
              link={getChecklistPageLink(propertyType, 'Buying')}
            />
          ))}
        </SideNavSection>
      </PageSideNav>
    </>
  )
}
