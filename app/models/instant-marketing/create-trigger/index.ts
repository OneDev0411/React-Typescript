// import Fetch from '../../../services/fetch'
// import { renderBrandedNunjuksTemplate } from 'utils/marketing-center/render-branded-nunjuks-template'

// interface TemplateInstanceInputData {
//   brand: IBrand
//   template: IBrandMarketingTemplate
// }

export async function createTrigger(
  brand: IBrand,
  template: IBrandMarketingTemplate
): Promise<any> {
  try {
    if (!brand || !template) {
      throw new Error('brand or teplate not provided')
    }

    // const response = await new Fetch()
    //   .post(`/trigger`)
    //   .send(data)
  } catch (e) {
    throw e
  }
}
