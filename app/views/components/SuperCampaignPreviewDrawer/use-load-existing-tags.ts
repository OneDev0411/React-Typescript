import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { selectExistingTags } from '@app/selectors/contacts'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'

export function useLoadExistingTags() {
  const dispatch = useDispatch()

  const existingTags = useSelector(selectExistingTags)

  useEffectOnce(() => {
    if (existingTags.length === 0) {
      dispatch(getContactsTags())
    }
  })
}
