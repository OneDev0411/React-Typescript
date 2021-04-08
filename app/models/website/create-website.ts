import Fetch from 'services/fetch'

import { UpdateWebsiteData } from './update-website'

export type CreateWebsiteData = UpdateWebsiteData

async function createWebsite(data: CreateWebsiteData) {
  return (await new Fetch().post('/websites').send(data)).body.data as IWebsite
}

export default createWebsite
