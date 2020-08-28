import React from 'react'
import {
  Grid,
  Tooltip,
  IconButton,
  Avatar,
  Button,
  Theme,
  makeStyles,
  Box
} from '@material-ui/core'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult
} from 'react-beautiful-dnd'
import { mdiArrowUpDown, mdiTrashCanOutline, mdiCameraOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { BaseFieldProps } from './types'
import { TemplateVariable } from '../../types'

const useStyles = makeStyles((theme: Theme) => ({
  image: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  }
}))

interface Props extends BaseFieldProps<'sortableImageList'> {}

export default function SortableImageList({ variable, onChange }: Props) {
  const classes = useStyles()

  const reorderImages = (
    images: TemplateVariable<'sortableImageItem'>[],
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const reorderedImages = Array.from(images)
    const [removed] = reorderedImages.splice(sourceIndex, 1)

    reorderedImages.splice(destinationIndex, 0, removed)

    reorderedImages.forEach((item, index) => {
      item.name = `${variable.name}.${index}`
      item.label =
        index === 0 ? variable.label : `${variable.label} ${index + 1}`
    })

    return reorderedImages
  }

  const handleDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return
    }

    const reorderedImages = reorderImages(
      variable.images,
      result.source.index,
      result.destination.index
    )

    onChange({
      ...variable,
      images: reorderedImages
    })
  }

  const handleDeleteImage = (image: TemplateVariable<'sortableImageItem'>) => {
    const newVariable: TemplateVariable<'sortableImageList'> = {
      ...variable,
      images: variable.images
        .filter(item => item.name !== image.name)
        .map((item, index) => ({
          ...item,
          name: `${variable.name}.${index}`,
          label: index === 0 ? variable.label : `${variable.label} ${index + 1}`
        }))
    }

    onChange(newVariable)
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="sortable-images-droppable"
          ignoreContainerClipping
        >
          {(droppableProvided: DroppableProvided) => (
            <Grid
              container
              item
              spacing={2}
              innerRef={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {variable.images.map((image, index) => (
                <Draggable
                  key={image.name}
                  draggableId={image.name}
                  index={index}
                >
                  {(
                    draggableProvided: DraggableProvided,
                    draggableSnapshot: DraggableStateSnapshot
                  ) => (
                    <Grid
                      container
                      item
                      direction="row"
                      alignItems="center"
                      innerRef={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      style={{
                        ...draggableProvided.draggableProps.style,
                        ...(draggableSnapshot.isDragging
                          ? { background: 'rgb(235,235,235)' }
                          : {})
                      }}
                    >
                      <Grid item xs={2}>
                        <Tooltip
                          title="Drag photo to reorder"
                          aria-label="Drag photo to reorder"
                        >
                          <IconButton {...draggableProvided.dragHandleProps}>
                            <SvgIcon path={mdiArrowUpDown} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={8}>
                        <Avatar
                          variant="rounded"
                          className={classes.image}
                          alt={image.label}
                          src={image.value}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Delete photo" aria-label="Delete photo">
                          <IconButton onClick={() => handleDeleteImage(image)}>
                            <SvgIcon path={mdiTrashCanOutline} />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
      <Grid item>
        <Box py={2}>
          <Button fullWidth color="primary" variant="contained">
            <SvgIcon path={mdiCameraOutline} />
            &nbsp; Add photo
          </Button>
        </Box>
      </Grid>
    </>
  )
}
