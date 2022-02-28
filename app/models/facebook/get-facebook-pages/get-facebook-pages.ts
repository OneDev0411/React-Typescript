export async function getFacebookPages(): Promise<IFacebookPage[]> {
  await waitFor(2000)

  // TODO: Implement this function
  const mockData: IFacebookPage[] = [
    {
      id: 'facebook-id-1',
      instagram_username: 'fakeuser1',
      instagram_profile_picture_url: 'https://picsum.photos/seed/image1/200/200'
    },
    {
      id: 'facebook-id-2',
      instagram_username: 'fakeuser2',
      instagram_profile_picture_url: 'https://picsum.photos/seed/image2/200/200'
    },
    {
      id: 'facebook-id-3',
      instagram_username: 'fakeuser3',
      instagram_profile_picture_url: 'https://picsum.photos/seed/image3/200/200'
    }
  ] as IFacebookPage[]

  return mockData
}

// TODO: remove this when the above
function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
