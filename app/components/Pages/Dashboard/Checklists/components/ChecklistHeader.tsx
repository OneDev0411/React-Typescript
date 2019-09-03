import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem
} from '@material-ui/core'

import React from 'react'

import SplitButton from 'components/SplitButton'

type Props = {
  checklist: IBrandChecklist
  setTerminable: (terminable: boolean) => void
  setDeactivatable: (terminable: boolean) => void
  addGenericItem: (checklist: IBrandChecklist) => void
  addGeneralCommentItem: (checklist: IBrandChecklist) => void
}

export function ChecklistHeader({
  addGeneralCommentItem,
  addGenericItem,
  checklist,
  setDeactivatable,
  setTerminable
}: Props) {
  const openFormPickerDrawer = () => {}

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1}>{checklist.title}</Box>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checklist.is_terminatable}
            onChange={event => setTerminable(event.target.checked)}
          />
        }
        label="Terminable"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={checklist.is_deactivatable}
            onChange={event => setDeactivatable(event.target.checked)}
          />
        }
        label="Deactivable"
      />
      <SplitButton
        appearance="primary"
        onClick={openFormPickerDrawer}
        renderMenu={({ closeMenu }) => (
          <List>
            <ListItem
              button
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                addGenericItem(checklist)
                closeMenu()
              }}
            >
              Add Generic Item
            </ListItem>
            {checklist.tasks.every(
              task => task.task_type !== 'GeneralComments'
            ) && (
              <ListItem
                button
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  addGeneralCommentItem(checklist)
                  closeMenu()
                }}
              >
                Add General Comments
              </ListItem>
            )}
          </List>
        )}
      >
        Add Form
      </SplitButton>
    </Box>
  )
}
