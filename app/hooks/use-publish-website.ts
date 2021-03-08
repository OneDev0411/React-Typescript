import { useDispatch, useSelector } from 'react-redux'

import useAsync from 'hooks/use-async'
import { addNotification as notify } from 'components/notification'
import type { IBrandMarketingTemplateWithResult } from 'components/InstantMarketing'
import type { CreateWebsiteData } from 'models/website/create-website'
import type { TemplateInstanceInputData } from 'models/instant-marketing/create-template-instance'
import getTemplateObject from 'components/InstantMarketing/helpers/get-template-object'
import createWebsiteTemplate from 'models/website/create-website-template'
import updateWebsiteTemplate from 'models/website/update-website-template'
import { selectUserId } from 'selectors/user'

interface WebsiteInstanceResult {
  instance: IMarketingTemplateInstance
  website: IWebsite
}

function usePublishWebsite(
  onPublish: (result: WebsiteInstanceResult) => void,
  onError?: (error: Error) => void
) {
  const dispatch = useDispatch()
  const userId = useSelector(selectUserId)

  const { isLoading: isPublishing, run } = useAsync<WebsiteInstanceResult>()

  const publishWebsite = (
    websiteId: UUID | undefined,
    brandTemplate: IBrandMarketingTemplateWithResult,
    instanceData: TemplateInstanceInputData,
    websiteData: Omit<CreateWebsiteData, 'template_instance' | 'user'>
  ) => {
    const template = getTemplateObject(brandTemplate)
    const newWebsiteData = {
      ...websiteData,
      user: userId
    }

    run(async () =>
      !websiteId
        ? createWebsiteTemplate(template.id, instanceData, newWebsiteData)
        : updateWebsiteTemplate(
            websiteId,
            template.id,
            instanceData,
            newWebsiteData
          )
    ).then(
      result => {
        onPublish(result)
        dispatch(
          notify({ message: 'The website is published', status: 'success' })
        )
      },
      error => {
        onError?.(error)
        dispatch(
          notify({
            message: 'The publishing process failed, please try again',
            status: 'error'
          })
        )
      }
    )
  }

  return {
    publishWebsite,
    isPublishing,
    publishButtonLabel: isPublishing ? 'Publishing...' : 'Publish'
  }
}

export default usePublishWebsite
