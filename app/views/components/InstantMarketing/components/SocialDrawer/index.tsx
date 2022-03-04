import { useState } from 'react'

import { Box } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import { addNotification as notify } from 'components/notification'
import Drawer from 'components/OverlayDrawer'
import {
  createTemplateInstance,
  TemplateInstanceInputData
} from 'models/instant-marketing/create-template-instance'

import SocialDrawerActions from './SocialDrawerActions'
import SocialDrawerPreviewFile from './SocialDrawerPreviewFile'

interface Props {
  template: (IBrandMarketingTemplate | IMarketingTemplate) & { result: string }
  instance?: IMarketingTemplateInstance
  brandAsset?: IBrandAsset
  templateInstanceData?: Omit<TemplateInstanceInputData, 'html'>
  onClose: () => void
}

export default function SocialDrawer({
  template,
  instance: passedInstance,
  brandAsset,
  templateInstanceData = {},
  onClose
}: Props) {
  const dispatch = useDispatch()

  const [templateInstance, setTemplateInstance] =
    useState<Optional<IMarketingTemplateInstance>>(passedInstance)
  const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null)

  useDeepCompareEffect(() => {
    async function makeTemplateInstance() {
      if (brandAsset) {
        return
      }

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

  const instance = templateInstance || brandAsset

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title="Schedule or Share?" />
      <Drawer.Body>
        <Box my={3}>
          <SocialDrawerPreviewFile instance={instance} error={errorMessage} />
          {instance && <SocialDrawerActions instance={instance} />}
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}
