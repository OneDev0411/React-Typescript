import { useGetActiveBrandFacebookPages } from '@app/models/facebook'

interface UseGetFacebookPageById {
  isLoading: boolean
  facebookPage: Nullable<IFacebookPage>
}

export function useGetFacebookPageById(
  facebookPageId: UUID
): UseGetFacebookPageById {
  const { data: facebookPages, isLoading } = useGetActiveBrandFacebookPages()

  const facebookPage = facebookPages?.find(
    facebookPage => facebookPage.id === facebookPageId
  )

  return {
    isLoading,
    facebookPage: facebookPage ?? null
  }
}
