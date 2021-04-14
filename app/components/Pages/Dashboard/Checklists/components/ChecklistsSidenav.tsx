import { Button, Typography, Box } from '@material-ui/core'

import SideNavSection from '../../../../../views/components/PageSideNav/SideNavSection'
import PageSideNav from '../../../../../views/components/PageSideNav'

import { ChecklistsSidenavItem } from './ChecklistsSidenavItem'

interface Props {
  propertyTypes: IDealPropertyType[]
  checklistType: IDealChecklistType
  onClickNewProperty: () => void
}

export function ChecklistsSidenav({
  propertyTypes,
  checklistType,
  onClickNewProperty
}: Props) {
  return (
    <>
      <PageSideNav width="13rem" isOpen>
        <Typography variant="subtitle1">Checklists</Typography>
        <SideNavSection>
          {propertyTypes.map(propertyType => (
            <ChecklistsSidenavItem
              key={propertyType.id}
              checklistType={checklistType}
              propertyType={propertyType}
            />
          ))}

          <Box ml={1}>
            <Button
              color="secondary"
              size="medium"
              onClick={onClickNewProperty}
            >
              Add New Property
            </Button>
          </Box>
        </SideNavSection>
      </PageSideNav>
    </>
  )
}
