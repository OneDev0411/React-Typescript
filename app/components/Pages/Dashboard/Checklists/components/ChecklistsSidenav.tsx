import { Button, Typography, Box } from '@material-ui/core'
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
  ResponderProvided
} from 'react-beautiful-dnd'

import PageSideNav from '../../../../../views/components/PageSideNav'
import SideNavSection from '../../../../../views/components/PageSideNav/SideNavSection'

import { ChecklistsSidenavItem } from './ChecklistsSidenavItem'

interface Props {
  propertyTypes: IDealPropertyType[]
  checklistType: IDealChecklistType
  onClickNewProperty: () => void
  onReorder: (result: DropResult, provided: ResponderProvided) => void
}

export function ChecklistsSidenav({
  propertyTypes,
  checklistType,
  onReorder,
  onClickNewProperty
}: Props) {
  return (
    <>
      <PageSideNav width="15rem" isOpen>
        <Typography variant="subtitle1">Checklists</Typography>
        <SideNavSection>
          <DragDropContext onDragEnd={onReorder}>
            <Droppable droppableId="list" type="column" direction="vertical">
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {propertyTypes.map((propertyType, index) => (
                    <ChecklistsSidenavItem
                      key={propertyType.id}
                      index={index}
                      checklistType={checklistType}
                      propertyType={propertyType}
                    />
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Box mt={1} ml={1.5}>
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
