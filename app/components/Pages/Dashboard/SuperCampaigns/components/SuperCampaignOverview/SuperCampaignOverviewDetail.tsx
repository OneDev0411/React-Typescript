import { Card, makeStyles } from '@material-ui/core'
import format from 'date-fns/format'

import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import SuperCampaignOverviewDetailLabelValue from './SuperCampaignOverviewDetailLabelValue'
import SuperCampaignOverviewDetailTemplate from './SuperCampaignOverviewDetailTemplate'
import SuperCampaignOverviewDetailTitle from './SuperCampaignOverviewDetailTitle'

const useStyles = makeStyles(
  theme => ({
    root: { padding: theme.spacing(2) },
    title: {
      marginRight: -5,
      marginBottom: theme.spacing(2)
    },
    labelValue: {
      marginBottom: theme.spacing(3),
      '&:last-of-type': { marginBottom: 0 }
    },
    section: { marginBottom: theme.spacing(6) }
  }),
  { name: 'SuperCampaignOverviewDetail' }
)

function SuperCampaignOverviewDetail() {
  const classes = useStyles()
  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()
  const { saveSuperCampaign } = useSaveSuperCampaign(
    superCampaign,
    setSuperCampaign
  )

  const handleEdit = () => console.log('handleEdit')

  const handleTemplateChange = (template: IMarketingTemplateInstance) =>
    saveSuperCampaign({ template_instance: template })

  return (
    <Card className={classes.root} variant="outlined">
      <div className={classes.section}>
        <SuperCampaignOverviewDetailTitle
          className={classes.title}
          title="Details"
          actionLabel="Edit"
          onActionClick={handleEdit}
        />
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Email Subject"
          value={superCampaign.subject || '-'}
        />
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Description"
          value={superCampaign.description || '-'}
        />
        {}
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Scheduled for"
          value={
            superCampaign.due_at
              ? format(
                  superCampaign.due_at,
                  "EEEE, LLLL dd, yyyy 'at' HH:mmaaa"
                )
              : '-'
          }
        />
      </div>
      <SuperCampaignOverviewDetailTemplate
        titleClassName={classes.title}
        template={superCampaign.template_instance}
        onTemplateChange={handleTemplateChange}
      />
    </Card>
  )
}

export default SuperCampaignOverviewDetail
