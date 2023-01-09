import { useState } from 'react'

import {
  Box,
  Checkbox,
  createStyles,
  FormControlLabel,
  ListItem,
  List,
  makeStyles
} from '@material-ui/core'

import { PreviewActionButton } from '@app/views/components/DocumentsRepository/components/row-actions/PreviewActionButton'
import { SelectActionButton } from '@app/views/components/DocumentsRepository/components/row-actions/SelectActionButton'
import { DocumentsRepositoryDialog } from '@app/views/components/DocumentsRepository/Dialog'
import SplitButton from 'components/SplitButton'
import { useDictionary } from 'hooks/use-dictionary'

type Props = {
  checklist?: IBrandChecklist
  setTerminable: (terminable: boolean) => void
  setDeactivatable: (terminable: boolean) => void
  addGenericTask: (checklist: IBrandChecklist) => void
  addSplitterTask: (checklist: IBrandChecklist) => void
  addGeneralCommentTask: (checklist: IBrandChecklist) => void
  addFormTask: (checklist: IBrandChecklist, form: IBrandForm) => void
  renameChecklist: (name: string) => void
}

const useChecklistHeaderStyles = makeStyles(
  () =>
    createStyles({
      splitButton: {
        minWidth: '12rem'
      },
      splitMenuItem: {
        whiteSpace: 'nowrap'
      }
    }),
  { name: 'ChecklistHeader' }
)

export function ChecklistHeader({
  addGeneralCommentTask,
  addGenericTask,
  addFormTask,
  addSplitterTask,
  checklist,
  setDeactivatable,
  setTerminable
}: Props) {
  const [isDeactivatableChanging, setDeactivatableChanging] =
    useDictionary<boolean>()
  const [isTerminableChanging, setTerminableChanging] = useDictionary<boolean>()
  const [formPickerOpen, setFormPickerOpen] = useState(false)

  const classes = useChecklistHeaderStyles()

  const openFormPickerDrawer = () => {
    setFormPickerOpen(true)
  }

  const onSelectFormTask = async (form: IBrandForm) => {
    if (checklist) {
      setFormPickerOpen(false)
      await addFormTask(checklist, form)
    }
  }

  if (!checklist) {
    return null
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end">
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            disabled={isTerminableChanging(checklist.id)}
            checked={checklist.is_terminatable}
            onChange={async event => {
              setTerminableChanging(checklist.id, true)
              await setTerminable(event.target.checked)
              setTerminableChanging(checklist.id, false)
            }}
          />
        }
        label="Terminable"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            disabled={isDeactivatableChanging(checklist.id)}
            checked={checklist.is_deactivatable}
            onChange={async event => {
              setDeactivatableChanging(checklist.id, true)
              await setDeactivatable(event.target.checked)
              setDeactivatableChanging(checklist.id, false)
            }}
          />
        }
        label="Deactivable"
      />
      <SplitButton
        color="primary"
        variant="contained"
        size="small"
        onClick={openFormPickerDrawer}
        className={classes.splitButton}
        RenderMenu={({ closeMenu }) => (
          <List dense>
            <ListItem
              className={classes.splitMenuItem}
              button
              onClick={event => {
                addGenericTask(checklist)
                closeMenu(event)
              }}
            >
              Add Generic Task
            </ListItem>
            <ListItem
              className={classes.splitMenuItem}
              button
              onClick={event => {
                addSplitterTask(checklist)
                closeMenu(event)
              }}
            >
              Add Splitter
            </ListItem>
            {Array.isArray(checklist.tasks) &&
              checklist.tasks.every(
                task => task.task_type !== 'GeneralComments'
              ) && (
                <ListItem
                  className={classes.splitMenuItem}
                  button
                  onClick={event => {
                    addGeneralCommentTask(checklist)
                    closeMenu(event)
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
      {formPickerOpen && (
        <DocumentsRepositoryDialog
          isOpen
          selectionType="single"
          RowActionsBuilder={({ form }) => (
            <>
              <PreviewActionButton form={form} />
              <SelectActionButton form={form} onSelect={onSelectFormTask} />
            </>
          )}
          onClose={() => setFormPickerOpen(false)}
        />
      )}
    </Box>
  )
}
