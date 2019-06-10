import { testSelector } from '../../helpers'

export async function expandTags(contactsPage) {
  const showMore = await contactsPage.$(
    `${testSelector('tags-list')} ${testSelector('show-more-button')}`
  )

  if (showMore) {
    console.log('showMore exists')
    await showMore.click()
  }
}
