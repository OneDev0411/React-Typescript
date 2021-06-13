import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Box, makeStyles, Theme } from '@material-ui/core'

import { Step } from './Step'
import { NewStep } from './New'

const useStyles = makeStyles(
  (theme: Theme) => ({
    timeline: {
      margin: 'auto',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: '730px', // From figma
      position: 'relative',
      '&::after': {
        position: 'absolute',
        top: '0',
        content: "''",
        width: '1px',
        height: '100%',
        background: theme.palette.divider,
        zIndex: 0
      }
    },
    NewStepContainer: {
      margin: theme.spacing(2, 'auto', 0),
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '100%',
      maxWidth: '730px' // From figma
    },
    droppableProvider: {
      width: '100%',
      zIndex: 1
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
  onStepMove: (
    stepId: UUID,
    sourceIndex: number,
    destinationIndex: number
  ) => Promise<any>
  onNewEmailTemplateClick: () => void
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
  onNewEmailTemplateClick
}: Props) {
  const classes = useStyles()

  return (
    <>
      <DragDropContext
        onDragEnd={result =>
          onStepMove(
            result.draggableId,
            result.source.index,
            result.destination ? result.destination.index : result.source.index
          )
        }
      >
        <Box className={classes.timeline}>
          <Droppable droppableId="flow-steps-droppable">
            {(droppableProvided, draggableSnapshot) => (
              <div
                className={classes.droppableProvider}
                ref={droppableProvided.innerRef}
              >
                {items.map((item, index) => {
                  const stepIndex = index + 1
                  const prevStep = index > 0 ? items[index - 1] : null
                  const isLastStep = stepIndex === items.length

                  return (
                    <React.Fragment key={item.id}>
                      <Box
                        mb={
                          draggableSnapshot.isDraggingOver || disableEdit
                            ? 3
                            : 0
                        }
                      >
                        <Step
                          index={stepIndex}
                          key={item.id}
                          step={item}
                          prevStep={prevStep}
                          disableEdit={disableEdit}
                          isLastStep={isLastStep}
                          onUpdate={onStepUpdate}
                          onDelete={onStepDelete}
                          onStepMove={onStepMove}
                          emailTemplates={emailTemplates}
                          defaultSelectedEmailTemplate={
                            defaultSelectedEmailTemplate
                          }
                          onNewEmailTemplateClick={onNewEmailTemplateClick}
                        />
                      </Box>
                      {!isLastStep &&
                        !disableEdit &&
                        !draggableSnapshot.isDraggingOver && (
                          <Box width="100%" my={3}>
                            <NewStep
                              miniMode
                              index={stepIndex + 1}
                              emailTemplates={emailTemplates}
                              defaultSelectedEmailTemplate={
                                defaultSelectedEmailTemplate
                              }
                              onSubmit={onNewStepSubmit}
                              onNewEmailTemplateClick={onNewEmailTemplateClick}
                            />
                          </Box>
                        )}
                    </React.Fragment>
                  )
                })}
              </div>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
      {!disableEdit && (
        <Box className={classes.NewStepContainer}>
          <NewStep
            index={items.length > 0 ? items[items.length - 1].order + 1 : 1}
            shouldShowDefaultForm={false}
            emailTemplates={emailTemplates}
            defaultSelectedEmailTemplate={defaultSelectedEmailTemplate}
            onSubmit={onNewStepSubmit}
            onNewEmailTemplateClick={onNewEmailTemplateClick}
          />
        </Box>
      )}
    </>
  )
}
