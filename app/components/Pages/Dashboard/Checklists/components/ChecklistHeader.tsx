import React, { useMemo, useState } from 'react'
import {
  Box,
  Checkbox,
  createStyles,
  FormControlLabel,
  ListItem,
  List,
  makeStyles,
  Theme
} from '@material-ui/core'
import usePromise from 'react-use-promise'
import Fuse from 'fuse.js'

import { ListItem as FormListItem } from 'deals/components/TaskCreate/styled'

import SplitButton from 'components/SplitButton'
import { useDictionary } from 'hooks/use-dictionary'
import SearchDrawer from 'components/SearchDrawer'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

type Props = {
  checklist: IBrandChecklist
  setTerminable: (terminable: boolean) => void
  setDeactivatable: (terminable: boolean) => void
  addGenericItem: (checklist: IBrandChecklist) => void
  addGeneralCommentItem: (checklist: IBrandChecklist) => void
  forms: IDealForm[]
  formsState: ReturnType<typeof usePromise>[2]
}

const useChecklistHeaderStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      splitButton: {
        minWidth: '12rem'
      },
      test: {
        background: 'red!important'
      }
    }),
  { name: 'ChecklistHeader' }
)

const ItemRow = props => {
  return (
    <>
      <FormListItem onClick={props.onClick}>
        <TextMiddleTruncate text={props.item.name} maxLength={70} />
      </FormListItem>
    </>
  )
}

export function ChecklistHeader({
  addGeneralCommentItem,
  addGenericItem,
  checklist,
  forms,
  formsState,
  setDeactivatable,
  setTerminable
}: Props) {
  const [isDeactivatableChanging, setDeactivatableChanging] = useDictionary<
    boolean
  >()
  const [isTerminableChanging, setTerminableChanging] = useDictionary<boolean>()
  const [formPickerOpen, setFormPickerOpen] = useState(false)

  const classes = useChecklistHeaderStyles()

  const formSearchFuse = useMemo(
    () => new Fuse<IDealForm>(forms, { keys: ['name'] }),
    [forms]
  )

  const openFormPickerDrawer = () => {
    setFormPickerOpen(true)
  }

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1}>{checklist.title}</Box>
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
        renderMenu={({ closeMenu }) => (
          <List>
            <ListItem
              button
              style={{ whiteSpace: 'nowrap' }}
              onClick={event => {
                addGenericItem(checklist)
                closeMenu(event)
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
      {formPickerOpen && (
        <SearchDrawer
          title="Select a form"
          searchFunction={q => formSearchFuse.search(q)}
          onSelectItems={items => {
            // TODO
            setFormPickerOpen(false)
            console.log(items)
          }}
          isOpen={formPickerOpen}
          ItemRow={ItemRow}
          searchInputOptions={{
            placeholder: 'Type in to search'
          }}
          // we can enable multipleSelection but the experience is a
          // little different and probably needs better components for
          // rendering items
          multipleSelection={false}
          normalizeSelectedItem={i => i}
          defaultList={forms || []}
          defaultListTitle=""
          onClose={() => setFormPickerOpen(false)}
          showLoadingIndicator={formsState === 'pending'}
        />
      )}
    </Box>
  )
}
