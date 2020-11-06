import Fetch from '../../../services/fetch'

// Taken from this: SearchListingDrawer/helpers/get-mock-listing/mock_listing.json
// We're not importing the mock listing itself because it's a very big file and
// it will cause performance issues
const MOCK_LISTING_ID: UUID = 'fb403302-b062-11e8-8aa6-0a95998482ac'

interface TemplateInstanceInputData {
  html: string
  deals?: UUID[]
  listings?: UUID[]
  contacts?: UUID[]
}

export async function createTemplateInstance(
  templateId: UUID,
  data: TemplateInstanceInputData
): Promise<IMarketingTemplateInstance> {
  try {
    // We should never send our mock listing id to API
    if (data.listings) {
      data.listings = data.listings.filter(id => id !== MOCK_LISTING_ID)
    }

    const response = await new Fetch()
      .post(`/templates/${templateId}/instances`)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}
