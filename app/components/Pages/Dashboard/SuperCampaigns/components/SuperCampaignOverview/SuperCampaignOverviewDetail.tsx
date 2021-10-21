import { makeStyles } from '@material-ui/core'
import format from 'date-fns/format'

import useSafeState from '@app/hooks/use-safe-state'

import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'
import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'
import SuperCampaignDrawer from '../SuperCampaignDrawer'
import { SuperCampaignFormValues } from '../SuperCampaignDrawer/types'
import SuperCampaignTemplate from '../SuperCampaignTemplate/SuperCampaignTemplate'

import SuperCampaignOverviewDetailLabelValue from './SuperCampaignOverviewDetailLabelValue'

const useStyles = makeStyles(
  theme => ({
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
  const { isSaving, saveSuperCampaign } = useSaveSuperCampaign(
    superCampaign,
    setSuperCampaign
  )
  const [isDrawerOpen, setIsDrawerOpen] = useSafeState(false)

  const openDrawer = () => setIsDrawerOpen(true)

  const closeDrawer = () => setIsDrawerOpen(false)

  const handleTemplateChange = (template: IMarketingTemplateInstance) =>
    saveSuperCampaign({ template_instance: template })

  const handleSuperCampaignConfirm = async (
    formValues: SuperCampaignFormValues
  ) => {
    await saveSuperCampaign(formValues)
    closeDrawer()
  }

  return (
    <SuperCampaignCard>
      <div className={classes.section}>
        <SuperCampaignCardHeader
          className={classes.title}
          title="Details"
          actionLabel="Edit"
          onActionClick={openDrawer}
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
      <SuperCampaignTemplate
        titleClassName={classes.title}
        titleVariant="body1"
        template={superCampaign.template_instance}
        onTemplateChange={handleTemplateChange}
      />
      <SuperCampaignDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        formInitialValues={superCampaign}
        onConfirm={handleSuperCampaignConfirm}
        actionButtonsDisabled={isSaving}
      />
    </SuperCampaignCard>
  )
}

export default SuperCampaignOverviewDetail
