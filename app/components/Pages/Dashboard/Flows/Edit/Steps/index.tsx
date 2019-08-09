import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Grid } from '@material-ui/core'

import Item from './Item'
import New from './New'
import { getNextStepStartFrom } from '../helpers'

interface Props {
  disableEdit: boolean
  items: IBrandFlowStep[]
  emailTemplates: IBrandEmailTemplate[]
  onNewStepSubmit: (data: IBrandFlowStepInput) => Promise<any>
  onStepDelete: (step: IBrandFlowStep) => Promise<any>
  onStepUpdate: (step: IBrandFlowStepInput, stepId: UUID) => Promise<any>
  onStepMove: (sourceIndex: number, destinationIndex: number) => Promise<any>
}

export default function Steps({
  disableEdit,
  items,
  emailTemplates,
  onNewStepSubmit,
  onStepDelete,
  onStepUpdate,
  onStepMove
}: Props) {
  const startFromSeconds = items.length
    ? getNextStepStartFrom(items[items.length - 1])
    : 0

  return (
    <DragDropContext
      onDragEnd={result =>
        onStepMove(
          result.source.index,
          result.destination ? result.destination.index : result.source.index
        )
      }
    >
      <Grid container item justify="center" xs={11} md={6}>
        <Droppable droppableId="flow-steps-droppable">
          {droppableProvided => (
            <div style={{ width: '100%' }} ref={droppableProvided.innerRef}>
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
                  />
                )
              })}
            </div>
          )}
        </Droppable>
        {!disableEdit && (
          <New
            index={items.length + 1}
            startFrom={startFromSeconds}
            emailTemplates={emailTemplates}
            onSubmit={onNewStepSubmit}
            isNewEventFormOpen={items.length === 0}
          />
        )}
      </Grid>
    </DragDropContext>
  )
}
