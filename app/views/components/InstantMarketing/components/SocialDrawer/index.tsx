import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import { getFileType } from 'utils/file-utils/get-file-type'
import {
  createTemplateInstance,
  TemplateInstanceInputData
} from 'models/instant-marketing/create-template-instance'

import { addNotification as notify } from 'components/notification'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import Drawer from 'components/OverlayDrawer'

import PreviewFile from './PreviewFile'
import SendSMS from './SendSMS'
import DownloadFile from './DownloadFile'
import CopyFileUrl from './CopyFileUrl'

interface Props {
  template: (IBrandMarketingTemplate | IMarketingTemplate) & { result: string }
  instance?: IMarketingTemplateInstance
  templateInstanceData?: Omit<TemplateInstanceInputData, 'html'>
  onClose: () => void
}

export default function SocialDrawer({
  template,
  instance: passedInstance,
  templateInstanceData = {},
  onClose
}: Props) {
  const dispatch = useDispatch()

  const [templateInstance, setTemplateInstance] = useState<
    Optional<IMarketingTemplateInstance>
  >(passedInstance)
  const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null)

  useDeepCompareEffect(() => {
    async function makeTemplateInstance() {
      if (templateInstance) {
        return
      }

      try {
        const marketingTemplate = getTemplateObject(template)

        const instance = await createTemplateInstance(marketingTemplate.id, {
          ...templateInstanceData,
          html: template.result
        })

        setTemplateInstance(instance)
        dispatch(
          notify({
            status: 'success',
            message: 'Saved! You can find it in My Designs section.'
          })
        )
      } catch (error) {
        setErrorMessage('Oops, Something went wrong. please try again.')

        console.error(error)
      }
    }

    makeTemplateInstance()
  }, [dispatch, template, templateInstance, templateInstanceData])

  const getActions = () => {
    if (templateInstance && getFileType(templateInstance.file) === 'pdf') {
      return [DownloadFile, CopyFileUrl]
    }

    return [DownloadFile, SendSMS, CopyFileUrl]
  }

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title="How would you like to share?" />
      <Drawer.Body>
        <PreviewFile instance={templateInstance} error={errorMessage} />

        {templateInstance && (
          <>
            {getActions().map((Component, index) => (
              <Component key={index} instance={templateInstance} />
            ))}
          </>
        )}
      </Drawer.Body>
    </Drawer>
  )
}
