import React, { ComponentProps } from 'react'
import { connect } from 'react-redux'

import { ImagePreviewModal } from 'components/ImagePreviewModal'
import { getBrandByType } from 'utils/user-teams'
import {
  getTemplateImage,
  navigateBetweenTemplatesUsingKeyboard,
  selectNextTemplate,
  selectPreviousTemplate
} from 'utils/marketing-center/helpers'

import { IAppState } from 'reducers/index'

import PreviewModalMenu from './PreviewModalMenu'

interface Props {
  type: string // can be improved
  medium: string // can be improved
  templates: (IMarketingTemplate | IMarketingTemplateInstance)[]
  selectedTemplate: IMarketingTemplate | IMarketingTemplateInstance
  setSelectedTemplate: (
    template: IMarketingTemplate | IMarketingTemplateInstance
  ) => void
  isOpen: boolean
  onClose: () => void
  handleAction: () => void
}

interface StateProps {
  user: IUser
}

function PreviewModal(props: Props & StateProps) {
  const { selectedTemplate, templates, medium } = props

  if (!selectedTemplate) {
    return null
  }

  const brokerageBrand = getBrandByType(props.user, 'Brokerage')
  const { thumbnail: imgSrcTiny, original: imgSrc } = getTemplateImage(
    selectedTemplate,
    brokerageBrand
  )

  let modalProps: ComponentProps<typeof ImagePreviewModal> = {
    isOpen: props.isOpen,
    handleClose: () => props.onClose(),
    menuRenderer: () => (
      <PreviewModalMenu
        selectedTemplate={selectedTemplate}
        handleAction={props.handleAction}
      />
    )
  }

  if (props.type === 'history') {
    modalProps = {
      ...modalProps,
      imgSrc
    }
  } else {
    modalProps = {
      ...modalProps,
      showPreviousButton: true,
      onPreviousButtonClick: e => {
        e.stopPropagation()

        const previous = selectPreviousTemplate(
          templates,
          selectedTemplate,
          medium
        )

        if (previous) {
          props.setSelectedTemplate(previous)
        }
      },
      showNextButton: true,
      onNextButtonClick: e => {
        e.stopPropagation()

        const next = selectNextTemplate(templates, selectedTemplate, medium)

        if (next) {
          props.setSelectedTemplate(next)
        }
      },
      handleKeyDown: e => {
        const nextTemplate = navigateBetweenTemplatesUsingKeyboard(
          e.key,
          templates,
          selectedTemplate,
          medium
        )

        if (nextTemplate) {
          props.setSelectedTemplate(nextTemplate)
        }
      },
      imgSrc,
      imgSrcTiny
    }
  }

  return <>{props.isOpen && <ImagePreviewModal {...modalProps} />}</>
}

export default connect<StateProps>(({ user }: IAppState) => ({ user }))(
  PreviewModal
)
