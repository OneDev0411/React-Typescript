import { useState } from 'react'

import { makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import {
  createTemplateInstance,
  TemplateInstanceInputData
} from '@app/models/instant-marketing/create-template-instance'
import getTemplateObject from '@app/views/components/InstantMarketing/helpers/get-template-object'
import { addNotification as notify } from '@app/views/components/notification'
import Drawer from '@app/views/components/OverlayDrawer'

import SocialDrawerActions from './SocialDrawerActions'
import SocialDrawerPreviewFile from './SocialDrawerPreviewFile'
import SocialDrawerProvider from './SocialDrawerProvider'
import SocialDrawerSocialPostForm, {
  SocialDrawerSocialPostFormProps
} from './SocialDrawerSocialPostForm'
import { SocialDrawerStep } from './types'

const useStyles = makeStyles(
  theme => ({
    preview: {
      margin: theme.spacing(3, 3, 0, 3),
      flexGrow: 0,
      flexShrink: 0
    },
    actions: { margin: theme.spacing(0, 3) },
    form: {
      margin: theme.spacing(4, 3, 0, 3),
      flexGrow: 1
    }
  }),
  { name: 'SocialDrawer' }
)

interface SocialDrawerProps
  extends Pick<
    SocialDrawerSocialPostFormProps,
    'onPostScheduled' | 'onPostSent'
  > {
  template: (IBrandMarketingTemplate | IMarketingTemplate) & { result: string }
  instance?: IMarketingTemplateInstance
  brandAsset?: IBrandAsset
  templateInstanceData?: Omit<TemplateInstanceInputData, 'html'>
  onClose: () => void
}

function SocialDrawer({
  template,
  instance: passedInstance,
  brandAsset,
  templateInstanceData = {},
  onClose,
  onPostScheduled,
  onPostSent
}: SocialDrawerProps) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [templateInstance, setTemplateInstance] =
    useState<Optional<IMarketingTemplateInstance>>(passedInstance)
  const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null)

  const [step, setStep] = useState<SocialDrawerStep>('Share')

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
      <SocialDrawerPreviewFile
        className={classes.preview}
        instance={instance}
        error={errorMessage}
      />
      <SocialDrawerProvider setStep={setStep}>
        {instance && (
          <>
            {step === 'Share' && (
              <SocialDrawerActions
                className={classes.actions}
                instance={instance}
              />
            )}
            {step === 'Schedule' && (
              <SocialDrawerSocialPostForm
                className={classes.form}
                instance={instance}
                onPostScheduled={onPostScheduled}
                onPostSent={onPostSent}
              />
            )}
          </>
        )}
      </SocialDrawerProvider>
    </Drawer>
  )
}

export default SocialDrawer
