import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Box, makeStyles, Theme } from '@material-ui/core'

import Item from './Item'
import { NewStep } from './New'
// import { getNextStepStartFrom } from '../helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      margin: 'auto',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: '730px' // From figma
    },
    droppableProvider: {
      width: '100%'
    }
  }),
  { name: 'Steps' }
)

interface Props {
  disableEdit: boolean
  items: IBrandFlowStep[]
  emailTemplates: IBrandEmailTemplate[]
  defaultSelectedEmailTemplate?: UUID
  onNewStepSubmit: (data: IBrandFlowStepInput) => Promise<any>
  onStepDelete: (step: IBrandFlowStep) => Promise<any>
  onStepUpdate: (step: IBrandFlowStepInput, stepId: UUID) => Promise<any>
  onStepMove: (sourceIndex: number, destinationIndex: number) => Promise<any>
  onNewEmailTemplateClick: () => void
  onReviewEmailTemplateClick: (template: IBrandEmailTemplate) => void
}

export default function Steps({
  disableEdit,
  items,
  emailTemplates,
  defaultSelectedEmailTemplate,
  onNewStepSubmit,
  onStepDelete,
  onStepUpdate,
  onStepMove,
  onNewEmailTemplateClick,
  onReviewEmailTemplateClick
}: Props) {
  const classes = useStyles()
  // const startFromSeconds = items.length
  //   ? getNextStepStartFrom(items[items.length - 1])
  //   : 0

  return (
    <>
      <DragDropContext
        onDragEnd={result =>
          onStepMove(
            result.source.index,
            result.destination ? result.destination.index : result.source.index
          )
        }
      >
        <Box className={classes.container}>
          <Droppable droppableId="flow-steps-droppable">
            {droppableProvided => (
              <div
                className={classes.droppableProvider}
                ref={droppableProvided.innerRef}
              >
                {items.map((item, index) => {
                  const prevStep = index > 0 ? items[index - 1] : undefined

                  return (
                    <Item
                      index={index}
                      disableEdit={disableEdit}
                      onUpdate={onStepUpdate}
                      onDelete={onStepDelete}
                      key={item.id}
                      step={item}
                      prevStep={prevStep}
                      emailTemplates={emailTemplates}
                      defaultSelectedEmailTemplate={
                        defaultSelectedEmailTemplate
                      }
                      onNewEmailTemplateClick={onNewEmailTemplateClick}
                      onReviewEmailTemplateClick={onReviewEmailTemplateClick}
                    />
                  )
                })}
              </div>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
      {!disableEdit && (
        <Box className={classes.container}>
          <NewStep
            index={items.length + 1}
            shouldShowDefaultForm={items.length === 0}
            emailTemplates={emailTemplates}
            defaultSelectedEmailTemplate={defaultSelectedEmailTemplate}
            onSubmit={onNewStepSubmit}
            onNewEmailTemplateClick={onNewEmailTemplateClick}
            onReviewEmailTemplateClick={onReviewEmailTemplateClick}
          />
        </Box>
      )}
    </>
  )
}
