import { useActiveBrandId } from '@app/hooks/brand'

import { useGetFacebookPages } from './use-get-facebook-pages'

export function useGetActiveBrandFacebookPages(): ReturnType<
  typeof useGetFacebookPages
> {
  const activeBrandId = useActiveBrandId()

  return useGetFacebookPages(activeBrandId)
}
