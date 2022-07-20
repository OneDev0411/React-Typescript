import { useState } from 'react'

import { useSelector } from 'react-redux'

import TemplateAction from '@app/views/components/TemplatesList/TemplateAction'
import MarketingTemplateAndTemplateInstancePickerModal from 'components/MarketingTemplatePickers/MarketingTemplateAndTemplateInstancePickerModal'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

interface Props {
  isOpen: boolean
  templateTypes: IWebsiteTemplateType[]
  onClose: () => void
}

export const WebsiteTemplateSelector = ({
  isOpen,
  templateTypes,
  onClose
}: Props) => {
  const user = useSelector<IAppState, IUser>(selectUser)
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IBrandMarketingTemplate>>(null)

  const handleClose = () => {
    onClose()
  }

  const handleSelectTemplate = async (template: IBrandMarketingTemplate) => {
    setSelectedTemplate(template)
    setIsBuilderOpen(true)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <MarketingTemplateAndTemplateInstancePickerModal
          title="Select Template"
          user={user}
          mediums={['Website']}
          templateTypes={templateTypes}
          onSelect={handleSelectTemplate}
          onClose={handleClose}
          shouldShowMyDesigns={false}
        />
      )}
      {selectedTemplate && (
        <TemplateAction
          type={selectedTemplate.template.type}
          medium="Website"
          isEdit={false}
          isTriggered={isBuilderOpen}
          setTriggered={(value: boolean) => {
            setIsBuilderOpen(value)
            setSelectedTemplate(null)
          }}
          setEditActionTriggered={(state: boolean) => {
            setSelectedTemplate(null)
            setIsBuilderOpen(state)
          }}
          selectedTemplate={selectedTemplate}
        />
      )}
    </>
  )
}
