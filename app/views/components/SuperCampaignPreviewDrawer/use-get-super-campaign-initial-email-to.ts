import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { selectExistingTags } from '@app/selectors/contacts'

export function useGetSuperCampaignInitialEmailTo(
  superCampaignTags: Nullable<string[]>
): IDenormalizedEmailRecipientTagInput[] {
  // I know this is not idea but there is no way to do this in a better way...
  // The getContactsTags belongs to contact feature and it is responsible for loading the existing tags
  // This code does not run under contacts feature so we need to make sure one of the parent components
  // calls the useLoadExistingTags hook to load the tags.
  // We decided to add the react-query package soon so this will be fixed when we have a special hook for
  // loading the tags.
  const existingTags = useSelector(selectExistingTags)

  const matchedTags = useMemo<IDenormalizedEmailRecipientTagInput[]>(() => {
    if (!existingTags || !superCampaignTags) {
      return []
    }

    return existingTags
      .filter(contactsTag => superCampaignTags.includes(contactsTag.text))
      .map(contactsTag => ({
        recipient_type: 'Tag',
        tag: contactsTag
      }))
  }, [existingTags, superCampaignTags])

  return matchedTags
}
