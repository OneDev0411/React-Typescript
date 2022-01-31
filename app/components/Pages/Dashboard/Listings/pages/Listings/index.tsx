import { useRef, useState } from 'react'

import { Box, Button, Grid } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import { WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import { goTo } from '@app/utils/go-to'
import PageLayout from '@app/views/components/GlobalPageLayout'
import { ReminderDialog } from '@app/views/components/ReminderDialog'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import SearchTextField from '../../components/SearchTextField'

import ListingsList from './ListingsList'
import ListingsOpenHouseProvider from './ListingsOpenHouseProvider'

type ListingsProps = WithRouterProps<{ brandId?: UUID }, {}>

const ADD_MLS_ACCOUNT_REMINDER_DISMISSED_SETTINGS_KEY =
  'listings_add_mls_account_reminder_dismissed'

function Listings({ params }: ListingsProps) {
  useTitle('Listings | Rechat')

  const addMlsAccountButtonRef = useRef<Nullable<HTMLButtonElement>>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddMlsAccountClick = () => {
    // Go to settings and open add MLS account dialog
    goTo('/dashboard/account/connected-accounts', null, {
      action: 'add-mls-account'
    })
  }

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Listings">
        <Grid spacing={2} container direction="row-reverse" alignItems="center">
          <Box width="100%" maxWidth={360}>
            <SearchTextField onChange={setSearchTerm} />
          </Box>
          <Grid item>
            <Button
              size="medium"
              color="default"
              variant="outlined"
              startIcon={<SvgIcon path={mdiPlus} />}
              ref={addMlsAccountButtonRef}
              onClick={handleAddMlsAccountClick}
            >
              Add MLS Account
            </Button>
            <ReminderDialog
              userSettingsKey={ADD_MLS_ACCOUNT_REMINDER_DISMISSED_SETTINGS_KEY}
              anchorEl={addMlsAccountButtonRef.current}
              image="/static/images/listing/listings-add-MLS-reminder.gif"
              title="Add all your MLS accounts to have access to all your listings."
              placement="bottom-start"
            />
          </Grid>
        </Grid>
      </PageLayout.Header>
      <PageLayout.Main>
        <ListingsOpenHouseProvider>
          <ListingsList searchTerm={searchTerm} />
        </ListingsOpenHouseProvider>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default Listings
