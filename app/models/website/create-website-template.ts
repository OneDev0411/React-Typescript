import {
  createTemplateInstance,
  CreateTemplateInstanceData
} from 'models/instant-marketing/create-template-instance'

import createWebsite, { CreateWebsiteData } from './create-website'

async function createWebsiteTemplate(
  templateId: UUID,
  instanceData: CreateTemplateInstanceData,
  websiteData: Omit<CreateWebsiteData, 'template_instance'>
) {
  const instance = await createTemplateInstance(templateId, instanceData)

  const website = await createWebsite({
    ...websiteData,
    template_instance: instance.id
  })

  return { instance, website }
}

export default createWebsiteTemplate
