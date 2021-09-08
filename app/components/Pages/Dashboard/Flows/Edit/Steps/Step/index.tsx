import BasicEmailForm from '../New/BasicEmailForm'
import EventForm from '../New/EventForm'
import MarketingEmailForm from '../New/MarketingEmailForm'

interface Props {
  index: number
  step: IBrandFlowStep
  prevStep?: Nullable<IBrandFlowStep>
  disableEdit: boolean
  isLastStep: boolean
  onDelete: (step: IBrandFlowStep) => Promise<any>
  onUpdate: (step: IBrandFlowStepInput, stepId: UUID) => Promise<any>
  onStepMove: (
    stepId: UUID,
    sourceIndex: number,
    destinationIndex: number
  ) => Promise<any>
}

export function Step({
  step,
  index,
  prevStep,
  isLastStep,
  disableEdit,
  onDelete,
  onUpdate,
  onStepMove
}: Props) {
  const prevStepOrder = prevStep ? prevStep.order : null

  const handleMoveUpStep = () => {
    if (index <= 1) {
      return
    }

    const destination = index - 1

    onStepMove(step.id, index, destination)
  }

  const handleMoveDownStep = () => {
    if (isLastStep) {
      return
    }

    const destination = index + 1

    onStepMove(step.id, index, destination)
  }

  const onMoveUpStep = index > 1 ? handleMoveUpStep : undefined
  const onMoveDownStep = !isLastStep ? handleMoveDownStep : undefined

  const renderForm = () => {
    if (!step) {
      return null
    }

    const commonProps = {
      step,
      index,
      disableEdit,
      prevStepOrder,
      onMoveUpStep,
      onMoveDownStep,
      onSubmit: onUpdate,
      onDelete: () => onDelete(step)
    }

    if (step.event) {
      return <EventForm {...commonProps} />
    }

    if (step.email) {
      return <BasicEmailForm {...commonProps} />
    }

    if (step.template || step.template_instance) {
      return <MarketingEmailForm {...commonProps} />
    }
  }

  return <>{renderForm()}</>
}
