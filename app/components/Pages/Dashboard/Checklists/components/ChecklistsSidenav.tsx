import React from 'react'

import { Button, Typography, Box } from '@material-ui/core'

import SideNavItem from 'components/PageSideNav/SideNavItem'

import SideNavSection from '../../../../../views/components/PageSideNav/SideNavSection'
import PageSideNav from '../../../../../views/components/PageSideNav'

import { getChecklistPageLink } from '../helpers/get-checklist-page-link'

interface Props {
  propertyTypes: IDealPropertyType[]
}

export function ChecklistsSidenav({ propertyTypes }: Props) {
  return (
    <>
      <PageSideNav width="13rem" isOpen>
        <Typography variant="subtitle1">Checklists</Typography>
        <SideNavSection>
          {propertyTypes.map(propertyType => (
            <SideNavItem
              key={propertyType.id}
              title={propertyType.label}
              link={getChecklistPageLink(propertyType.id)}
              onDelete={() => {}}
            />
          ))}

          <Box ml={1}>
            <Button color="secondary" size="medium">
              Add New Property
            </Button>
          </Box>
        </SideNavSection>
      </PageSideNav>
    </>
  )
}
