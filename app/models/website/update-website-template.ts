import {
  createTemplateInstance,
  CreateTemplateInstanceData
} from 'models/instant-marketing/create-template-instance'

import updateWebsite, { UpdateWebsiteData } from './update-website'

async function updateWebsiteTemplate(
  websiteId: UUID,
  templateId: UUID,
  instanceData: CreateTemplateInstanceData,
  websiteData: Omit<UpdateWebsiteData, 'template_instance'>
) {
  const instance = await createTemplateInstance(templateId, instanceData)

  const website = await updateWebsite(websiteId, {
    ...websiteData,
    template_instance: instance.id
  })

  return { instance, website }
}

export default updateWebsiteTemplate
