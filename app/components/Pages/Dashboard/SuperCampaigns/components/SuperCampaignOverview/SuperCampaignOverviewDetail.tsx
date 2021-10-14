import { Card, makeStyles } from '@material-ui/core'
import format from 'date-fns/format'

import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import SuperCampaignOverviewDetailLabelValue from './SuperCampaignOverviewDetailLabelValue'
import SuperCampaignOverviewDetailTemplatePreview from './SuperCampaignOverviewDetailTemplatePreview'
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
  const { superCampaign } = useSuperCampaignDetail()

  console.log('superCampaign', superCampaign)

  const handleEdit = () => console.log('handleEdit')

  const handleChangeTemplate = () => console.log('handleChangeTemplate')

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
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Scheduled for"
          value={format(
            superCampaign.due_at,
            "EEEE, LLLL dd, yyyy 'at' HH:mmaaa"
          )}
        />
      </div>

      <SuperCampaignOverviewDetailTitle
        className={classes.title}
        title="Template"
        actionLabel="Change"
        onActionClick={handleChangeTemplate}
      />
      <SuperCampaignOverviewDetailTemplatePreview
        templateInstance={superCampaign.template_instance}
        onClick={handleChangeTemplate}
      />
    </Card>
  )
}

export default SuperCampaignOverviewDetail
