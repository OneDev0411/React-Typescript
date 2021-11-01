import { memo } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'

import { SuperCampaignDetailProvider } from '../../components/SuperCampaignDetailProvider'
import SuperCampaignOverview from '../../components/SuperCampaignOverview'

import SuperCampaignDetailLoading from './SuperCampaignDetailLoading'
import { useGetSuperCampaign } from './use-get-super-campaign'

const useStyles = makeStyles(
  theme => ({
    header: {
      padding: theme.spacing(0, 4),
      height: theme.spacing(12),
      display: 'flex',
      alignItems: 'center'
    },
    body: { backgroundColor: theme.palette.grey[50] }
  }),
  { name: 'SuperCampaignDetail' }
)

type SuperCampaignDetailProps = RouteComponentProps<
  {
    id: UUID
  },
  {} // Used this empty type because if you pass `any` it ruins the params type
>

function SuperCampaignDetail({ params }: SuperCampaignDetailProps) {
  useTitle('Super Campaign Detail | Rechat')

  const classes = useStyles()

  const superCampaignId = params.id

  const { isLoading, superCampaign, setSuperCampaign } =
    useGetSuperCampaign(superCampaignId)

  return (
    <PageLayout gutter={0}>
      <div className={classes.header}>
        <PageLayout.Header
          title={isLoading ? '' : superCampaign?.subject || 'Untitled Campaign'}
        />
      </div>
      <PageLayout.Main mt={0} pt={2} pb={4} className={classes.body}>
        <Box px={4}>
          {isLoading || !superCampaign ? (
            <SuperCampaignDetailLoading />
          ) : (
            <SuperCampaignDetailProvider
              superCampaign={superCampaign}
              setSuperCampaign={setSuperCampaign}
            >
              <SuperCampaignOverview />
            </SuperCampaignDetailProvider>
          )}
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(SuperCampaignDetail)
