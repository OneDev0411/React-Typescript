import React, { useState } from 'react'
import cn from 'classnames'
import { Box, Button, Typography } from '@material-ui/core'
import { Theme, useTheme } from '@material-ui/core/styles'

import { useFilterCRMTasks } from 'hooks/use-filter-crm-tasks.ts'

import Drawer from 'components/OverlayDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'
import Loading from 'components/LoadingContainer'
import AddIcon from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { useIconStyles } from '../../../../styles/use-icon-styles'

import TourItem from './TourItem'

interface Props {
  isOpen: boolean
  listings: ICompactListing[]
  onClose: () => void
  submitCallback?: (tour: ICRMTask) => void
  user: IUser
}

export default function CreateTourDrawer(props: Props) {
  const theme = useTheme<Theme>()
  const iconClasses = useIconStyles()
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
            <AddIcon
              fillColor={theme.palette.primary.main}
              className={cn(iconClasses.rightMargin, iconClasses.small)}
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
            reloadList()
            handleClose()
            props.onClose()

            if (props.submitCallback) {
              props.submitCallback(tour)
            }
          }}
          tour={selectedTour}
          user={props.user}
        />
      )}
    </>
  )
}
