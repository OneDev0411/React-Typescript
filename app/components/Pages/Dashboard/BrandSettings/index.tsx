import { useState, useCallback, useContext } from 'react'

import { Grid, Button, Divider, Box } from '@material-ui/core'
import isEqual from 'lodash/isEqual'
import { Helmet } from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useActiveTeamPalette } from '@app/hooks/team'
import { selectUser } from '@app/selectors/user'
import { fetchActiveTeam } from 'actions/active-team'
import Acl from 'components/Acl'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import PageLayout from 'components/GlobalPageLayout'
import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import TemplatePreview from 'components/TemplatePreview'
import { ACL } from 'constants/acl'
import { updatePalette } from 'models/brand/update-palette'
import { uploadBrandAsset } from 'models/brand/upload-asset'
import { invalidateThumbnails } from 'models/instant-marketing/invalidate-thumbnails'
import { IAppState } from 'reducers'

import { TEMPLATE } from './constants'
import {
  getSidebarSections,
  getSimpleSidebarSections,
  getPreferredSidebarView
} from './helpers'
import Sidebar from './Sidebar'

export function BrandSettings() {
  const dispatch = useDispatch()
  const user = useSelector<IAppState, IUser>(selectUser)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const activeBrandId = useActiveBrandId()
  const activeTeamPalette = useActiveTeamPalette()
  const [defaultSettings, setDefaultSettings] =
    useState<Nullable<BrandMarketingPalette>>(null)
  const [settings, setSettings] =
    useState<BrandMarketingPalette>(activeTeamPalette)
  const [preferredSideBarView, setPreferredSidebarView] = useState(
    getPreferredSidebarView(settings)
  )
  const confirmation = useContext(ConfirmationModalContext)

  useEffectOnce(() => {
    async function loadMockLising() {
      setIsLoading(true)

      const mockedListing = await getMockListing()

      setListing(mockedListing as any as IListing)
      setIsLoading(false)
    }

    loadMockLising()
  })

  const resetSettings = () => {
    if (!defaultSettings) {
      return
    }

    confirmation.setConfirmationModal({
      message: `All your unsaved changes will be lost.
Are you sure?`,
      confirmLabel: 'Yes, I am',
      onConfirm: () => {
        setSettings(defaultSettings)
        setDefaultSettings(null)
      }
    })
  }

  const handleUpdateSettings = (newSettings: BrandMarketingPalette) => {
    if (!defaultSettings) {
      if (!isEqual(newSettings, settings)) {
        setDefaultSettings(settings)
      }
    } else if (isEqual(newSettings, defaultSettings)) {
      setDefaultSettings(null)
    }

    setSettings(newSettings)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    await updatePalette(activeBrandId, settings)
    await invalidateThumbnails(activeBrandId)
    setDefaultSettings(null)
    setIsLoading(false)
    dispatch(fetchActiveTeam())
  }

  const handleImageUpload = useCallback(
    async (image: File) => {
      setIsLoading(true)

      const brandAsset = await uploadBrandAsset([activeBrandId], image)

      setIsLoading(false)

      return brandAsset[0]!.file
    },
    [activeBrandId]
  )

  const sidebarSections =
    preferredSideBarView === 'full'
      ? getSidebarSections()
      : getSimpleSidebarSections()

  return (
    <Acl access={[ACL.ADMIN, ACL.MARKETING]}>
      <Helmet>
        <title>Brand Settings | Rechat</title>
      </Helmet>

      <PageLayout>
        <PageLayout.Header title="Brand Settings">
          <Grid container justifyContent="flex-end" spacing={2}>
            <Grid item>
              <Button
                disabled={isLoading || !defaultSettings}
                variant="outlined"
                size="large"
                onClick={resetSettings}
              >
                Reset Changes
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={isLoading || !defaultSettings}
                variant="contained"
                size="large"
                color="primary"
                onClick={saveSettings}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </PageLayout.Header>
        <PageLayout.Main>
          <Divider />
          <Grid container>
            <Grid container item md={9} direction="row">
              <TemplatePreview
                template={TEMPLATE}
                palette={settings}
                data={{
                  listing,
                  user
                }}
              />
            </Grid>
            <Sidebar
              defaultExpandedPanels={preferredSideBarView === 'simple'}
              sections={sidebarSections}
              settings={settings}
              onUpdate={handleUpdateSettings}
              onImageUpload={handleImageUpload}
            >
              <Grid container item justifyContent="center">
                <Box my={2}>
                  {preferredSideBarView === 'simple' ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPreferredSidebarView('full')}
                    >
                      Advanced Settings
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setPreferredSidebarView('simple')}
                    >
                      Simple Settings
                    </Button>
                  )}
                </Box>
              </Grid>
            </Sidebar>
          </Grid>
        </PageLayout.Main>
      </PageLayout>
    </Acl>
  )
}

export default withRouter(BrandSettings)
