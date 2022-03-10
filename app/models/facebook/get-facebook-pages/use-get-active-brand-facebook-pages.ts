import { useSelector } from 'react-redux'

import { selectActiveBrandId } from '@app/selectors/brand'

import { useGetFacebookPages } from './use-get-facebook-pages'

export function useGetActiveBrandFacebookPages(): ReturnType<
  typeof useGetFacebookPages
> {
  const activeBrandId = useSelector(selectActiveBrandId)

  return useGetFacebookPages(activeBrandId)
}
