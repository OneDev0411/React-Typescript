import { makeStyles } from '@material-ui/core'

import { useReplaceQueryParam } from '@app/hooks/use-query-param'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
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
  const [editDrawerParam, setEditDrawerParam, deleteEditDrawerParam] =
    useReplaceQueryParam('edit-drawer')

  const isSuperCampaignReadOnly = useIsSuperCampaignReadOnly(superCampaign)

  const openDrawer = () => setEditDrawerParam('open')

  const closeDrawer = () => deleteEditDrawerParam()

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
      <div className={classes.section} data-test="super-campaign-details">
        <SuperCampaignCardHeader
          className={classes.title}
          title="Details"
          actionLabel={!isSuperCampaignReadOnly ? 'Edit' : undefined}
          onActionClick={openDrawer}
        />
        <SuperCampaignOverviewDetailLabelValue
          className={classes.labelValue}
          label="Description"
          value={superCampaign.description || '-'}
        />
      </div>
      {superCampaign.template_instance && (
        <SuperCampaignTemplate
          titleClassName={classes.title}
          titleVariant="body1"
          template={superCampaign.template_instance}
          onTemplateChange={handleTemplateChange}
          readOnly={isSuperCampaignReadOnly}
        />
      )}
      <SuperCampaignDrawer
        isOpen={!!editDrawerParam && !isSuperCampaignReadOnly}
        onClose={closeDrawer}
        formInitialValues={superCampaign}
        onConfirm={handleSuperCampaignConfirm}
        actionButtonsDisabled={isSaving}
      />
    </SuperCampaignCard>
  )
}

export default SuperCampaignOverviewDetail
