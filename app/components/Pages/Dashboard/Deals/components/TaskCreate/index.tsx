import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { mdiPlusCircleOutline } from '@mdi/js'
import { Button } from '@material-ui/core'
import Fuse from 'fuse.js'
import { Box } from '@material-ui/core'
import { useMemo } from 'react'

import { selectForms } from 'reducers/deals/forms'
import { createFormTask } from 'actions/deals'

import LoadingContainer from 'components/LoadingContainer'
import { SearchInput } from 'components/GlobalHeaderWithSearch'
import OverlayDrawer from 'components/OverlayDrawer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { IAppState } from '@app/reducers'

import CreateCustomTask from './CustomTask'
import { ListItem } from './styled'

interface Props {
  isOpen: boolean
  deal: IDeal
  checklist: IDealChecklist | null
  onClose: () => void
}

export default function TaskCreate({
  isOpen,
  deal,
  checklist,
  onClose
}: Props) {
  const dispatch = useDispatch()

  const [searchFilter, setSearchFilter] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showCustomTaskDrawer, setShowCustomTaskDrawer] = useState(false)

  const forms = useSelector<IAppState, Record<UUID, IDealForm>>(
    ({ deals }) => selectForms(deals.forms, deal.id) || {}
  )

  const handleClose = () => {
    setSearchFilter('')
    setIsSaving(false)
    setShowCustomTaskDrawer(false)

    onClose()
  }

  const toggleCustomTaskDrawer = () => setShowCustomTaskDrawer(state => !state)

  const createTask = async (form: IDealForm) => {
    setIsSaving(true)

    try {
      const task = await dispatch(
        createFormTask(deal.id, form.id, form.name, checklist?.id)
      )

      return task
    } catch (e) {
      console.log(e)
    } finally {
      setIsSaving(false)
      handleClose()
    }
  }

  const filteredForms = useMemo(() => {
    return searchFilter
      ? new Fuse(Object.values(forms), {
          keys: ['name'],
          threshold: 0.7
        }).search(searchFilter)
      : Object.values(forms)
  }, [forms, searchFilter])

  return (
    <>
      <OverlayDrawer
        open={isOpen && showCustomTaskDrawer === false}
        onClose={handleClose}
      >
        <OverlayDrawer.Header
          title="Add new folder"
          menu={
            <Button
              disabled={isSaving}
              onClick={toggleCustomTaskDrawer}
              variant="outlined"
            >
              <SvgIcon path={mdiPlusCircleOutline} rightMargined />
              Create New Folder
            </Button>
          }
        />
        <OverlayDrawer.Body>
          {isSaving ? (
            <LoadingContainer
              style={{
                height: '90vh'
              }}
            />
          ) : (
            <>
              <Box my={1}>
                <SearchInput
                  fullWidth
                  placeholder="Type in to search..."
                  value={searchFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchFilter(e.target.value)
                  }
                />
              </Box>

              {filteredForms.map((form, index) => (
                <ListItem
                  key={`${form.id}_${index}`}
                  onClick={() => createTask(form)}
                  onDoubleClick={() => null}
                >
                  <TextMiddleTruncate text={form.name} maxLength={70} />
                </ListItem>
              ))}
            </>
          )}
        </OverlayDrawer.Body>
      </OverlayDrawer>

      <CreateCustomTask
        isOpen={showCustomTaskDrawer}
        onClose={toggleCustomTaskDrawer}
        handleCreateTask={createTask}
      />
    </>
  )
}
