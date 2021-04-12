import { memo, useState } from 'react'

import { useSelector } from 'react-redux'

import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'

import { selectUser } from 'selectors/user'

import ShowingStepYesNoQuestion, {
  YesNoAnswer
} from '../ShowingStepYesNoQuestion'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

interface ShowingStepFeedbackTemplateProps {
  value: Nullable<IMarketingTemplateInstance>
  onChange: (value: Nullable<IMarketingTemplateInstance>) => void
}

const MEDIUMS: IMarketingTemplateMedium[] = ['Email']
// TODO: select the final template types form the feedback
const TEMPLATE_TYPES: IMarketingTemplateType[] = [
  'OpenHouse',
  'JustSold',
  'ComingSoon',
  'JustListed',
  'PriceImprovement'
]

function ShowingStepFeedbackTemplate({
  value,
  onChange
}: ShowingStepFeedbackTemplateProps) {
  const [answer, setAnswer] = useState<Nullable<YesNoAnswer>>(
    value ? 'Yes' : null
  )
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const user = useSelector(selectUser)
  const nextStep = useQuestionWizardSmartNext()

  const handleChange = (value: YesNoAnswer) => {
    setAnswer(value)

    if (value === 'Yes') {
      setIsTemplateDialogOpen(true)
    } else {
      nextStep()
    }
  }

  const handleCloseTemplateDialog = () => {
    setIsTemplateDialogOpen(false)
  }

  const handleTemplateSelect = (
    template: IBrandMarketingTemplate | IMarketingTemplateInstance
  ) => {
    console.log('################### template', template)
    handleCloseTemplateDialog()
  }

  return (
    <>
      <ShowingStepYesNoQuestion
        question="Do you want to get feedback on this?"
        value={answer}
        onChange={handleChange}
        goNext={false}
        yesLabel="Yes, Let me choose a template."
      />
      {isTemplateDialogOpen && (
        <MarketingTemplateAndTemplateInstancePickerModal
          title="Feedback Email Template"
          user={user}
          onSelect={handleTemplateSelect}
          templateTypes={TEMPLATE_TYPES}
          mediums={MEDIUMS}
          onClose={handleCloseTemplateDialog}
        />
      )}
    </>
  )
}

export default memo(ShowingStepFeedbackTemplate)
