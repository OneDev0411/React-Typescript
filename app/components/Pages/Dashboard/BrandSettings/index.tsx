import React, { useState, useCallback, useContext } from 'react'
import { Grid, Button, Divider, Box } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import isEqual from 'lodash/isEqual'

import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import TemplatePreview from 'components/TemplatePreview'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { getActiveTeamPalette, getActiveTeamId } from 'utils/user-teams'
import { ACL } from 'constants/acl'

import { updatePalette } from 'models/brand/update-palette'
import { uploadBrandAsset } from 'models/brand/upload-asset'
import { invalidateThumbnails } from 'models/instant-marketing/invalidate-thumbnails'

import { getUserTeams } from 'actions/user/teams'

import { TEMPLATE } from './constants'
import {
  getSidebarSections,
  getSimpleSidebarSections,
  getPreferredSidebarView
} from './helpers'
import Sidebar from './Sidebar'

export function BrandSettings() {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listing, setListing] = useState<Nullable<IListing>>(null)
  const activeBrand = getActiveTeamId(user) as UUID
  const [defaultSettings, setDefaultSettings] = useState<
    Nullable<BrandSettingsPalette>
  >(null)
  const [settings, setSettings] = useState<BrandSettingsPalette>(
    getActiveTeamPalette(user)
  )
  const [preferredSideBarView, setPreferredSidebarView] = useState(
    getPreferredSidebarView(settings)
  )
  const confirmation = useContext(ConfirmationModalContext)

  useEffectOnce(() => {
    async function loadMockLising() {
      setIsLoading(true)

      const mockedListing = await getMockListing()

      setListing((mockedListing as any) as IListing)
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

  const handleUpdateSettings = (newSettings: BrandSettingsPalette) => {
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
    await updatePalette(activeBrand, settings)
    await invalidateThumbnails(activeBrand)
    setDefaultSettings(null)
    setIsLoading(false)
    dispatch(getUserTeams(user))
  }

  const handleImageUpload = useCallback(
    async (image: File) => {
      setIsLoading(true)

      const brandAsset = await uploadBrandAsset(activeBrand, image)

      setIsLoading(false)

      return brandAsset.file
    },
    [activeBrand]
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
          <Grid container justify="flex-end" spacing={2}>
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
              <Grid container item justify="center">
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
