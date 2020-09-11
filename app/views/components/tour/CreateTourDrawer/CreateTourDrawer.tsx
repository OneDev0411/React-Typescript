import React, { useState } from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import { Theme, useTheme } from '@material-ui/core/styles'
import { mdiPlusCircleOutline } from '@mdi/js'

import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks.ts'

import Drawer from 'components/OverlayDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'
import Loading from 'components/LoadingContainer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import TourItem from './TourItem'

interface Props {
  isOpen: boolean
  listings: ICompactListing[]
  onClose: () => void
  submitCallback?: (tour: ICRMTask) => void
  deleteCallback?: (tour: ICRMTask) => void
  user: IUser
}

export default function CreateTourDrawer(props: Props) {
  const theme = useTheme<Theme>()
  const [selectedTour, setSelectedTour] = useState<ICRMTask | null>(null)
  const [isOpenTourDrawer, setIsOpenTourDrawer] = useState<boolean>(false)
  const { list, isFetching, reloadList } = useFilterCRMTasks(
    {
      order: 'due_date',
      task_type: 'Tour'
    },
    {
      isFetching: true
    }
  )

  const handleClose = () => {
    setSelectedTour(null)
    setIsOpenTourDrawer(false)
  }

  const handleCallback = () => {
    reloadList()
    handleClose()
    props.onClose()
  }

  const renderBody = () => {
    if (isFetching) {
      return <Loading />
    }

    if (list.length > 0) {
      return (
        <Box py={2}>
          {list.map(item => (
            <TourItem
              key={item.id}
              dueDate={item.due_date}
              title={item.title}
              onClick={() => {
                setSelectedTour(item)
                setIsOpenTourDrawer(true)
              }}
            />
          ))}
        </Box>
      )
    }

    return (
      <Box py={3}>
        <Typography variant="h6">No tours are scheduled!</Typography>
      </Box>
    )
  }

  return (
    <>
      <Drawer open={props.isOpen} onClose={props.onClose}>
        <Drawer.Header title="Save to a Toursheet" />
        <Drawer.Body>{renderBody()}</Drawer.Body>
        <Drawer.Footer>
          <Button
            color="primary"
            size="large"
            onClick={() => setIsOpenTourDrawer(true)}
          >
            <SvgIcon
              path={mdiPlusCircleOutline}
              color={theme.palette.primary.main}
              rightMargined
              size={muiIconSizes.small}
            />
            Create New Toursheet
          </Button>
        </Drawer.Footer>
      </Drawer>
      {isOpenTourDrawer && (
        <TourDrawer
          isOpen
          listings={props.listings}
          onClose={handleClose}
          submitCallback={(tour: ICRMTask) => {
            handleCallback()

            if (props.submitCallback) {
              props.submitCallback(tour)
            }
          }}
          deleteCallback={(tour: ICRMTask) => {
            handleCallback()

            if (props.deleteCallback) {
              props.deleteCallback(tour)
            }
          }}
          tour={selectedTour}
          user={props.user}
        />
      )}
    </>
  )
}
