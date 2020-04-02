import React, { useState } from 'react'
import { Grid, Button, Divider } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import getMockListing from 'components/SearchListingDrawer/helpers/get-mock-listing'
import Acl from 'components/Acl'
import PageLayout from 'components/GlobalPageLayout'
import TemplatePreview from 'components/TemplatePreview'

import { getActiveTeamPalette, getActiveTeamId } from 'utils/user-teams'
import { ACL } from 'constants/acl'

import { updatePalette } from 'models/brand/update-palette'

import { getUserTeams } from 'actions/user/teams'

import { TEMPLATE } from './constants'
import { getSidebarSections } from './helpers'
import Sidebar from './Sidebar'

export function MarketingCenterSettings() {
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

    setSettings(defaultSettings)
    setDefaultSettings(null)
  }

  const handleUpdateSettings = (newSettings: BrandSettingsPalette) => {
    if (!defaultSettings) {
      setDefaultSettings(settings)
    }

    setSettings(newSettings)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    await updatePalette(activeBrand, settings)
    setDefaultSettings(null)
    setIsLoading(false)
    dispatch(getUserTeams(user))
  }

  const sidebarSections = getSidebarSections()

  return (
    <Acl access={[ACL.BACK_OFFICE, ACL.MARKETING]}>
      <Helmet>
        <title>Marketing Center Settings | Rechat</title>
      </Helmet>

      <PageLayout>
        <PageLayout.Header
          title="Marketing Center Settings"
          noGlobalActionsButton
        >
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
                disabled={isLoading}
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
              sections={sidebarSections}
              settings={settings}
              onUpdate={handleUpdateSettings}
            />
          </Grid>
        </PageLayout.Main>
      </PageLayout>
    </Acl>
  )
}

export default withRouter(MarketingCenterSettings)
