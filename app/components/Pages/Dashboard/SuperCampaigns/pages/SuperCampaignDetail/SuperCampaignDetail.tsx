import { memo } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'

import SuperCampaignOverview from '../../components/SuperCampaignOverview'
import { SuperCampaignProvider } from '../../components/SuperCampaignProvider'

import SuperCampaignDetailHeader from './SuperCampaignDetailHeader'
import SuperCampaignDetailLoading from './SuperCampaignDetailLoading'
import { useGetSuperCampaignForDetail } from './use-get-super-campaign-for-detail'

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
  useTitle('Campaign Detail | Rechat')

  const classes = useStyles()

  const superCampaignId = params.id

  const { isLoading, data: superCampaign } =
    useGetSuperCampaignForDetail(superCampaignId)

  return (
    <PageLayout gutter={0}>
      <div className={classes.header}>
        <PageLayout.Header
          title={isLoading ? '' : superCampaign?.subject || 'Untitled Campaign'}
        >
          {superCampaign && (
            <SuperCampaignDetailHeader superCampaign={superCampaign} />
          )}
        </PageLayout.Header>
      </div>
      <PageLayout.Main mt={0} pt={2} pb={4} className={classes.body}>
        <Box px={4}>
          {isLoading || !superCampaign ? (
            <SuperCampaignDetailLoading />
          ) : (
            <SuperCampaignProvider superCampaign={superCampaign}>
              <SuperCampaignOverview />
            </SuperCampaignProvider>
          )}
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(SuperCampaignDetail)
