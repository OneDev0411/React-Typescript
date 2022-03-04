import { makeStyles } from '@material-ui/core'

import { useReplaceQueryParam } from '@app/hooks/use-query-param'
import { useUpdateSuperCampaign } from '@app/models/super-campaign'

import { isSuperCampaignReadOnly } from '../../helpers'
import SuperCampaignCard from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import SuperCampaignDrawer from '../SuperCampaignDrawer'
import { SuperCampaignFormValues } from '../SuperCampaignDrawer/types'
import { useSuperCampaign } from '../SuperCampaignProvider'
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
  const superCampaign = useSuperCampaign()

  const { isLoading, mutateAsync } = useUpdateSuperCampaign()
  const [editDrawerParam, setEditDrawerParam, deleteEditDrawerParam] =
    useReplaceQueryParam('edit-drawer')

  const isReadOnly = isSuperCampaignReadOnly(superCampaign)

  const openDrawer = () => setEditDrawerParam('open')

  const closeDrawer = () => deleteEditDrawerParam()

  const handleTemplateChange = async (template: IMarketingTemplateInstance) => {
    await mutateAsync({
      superCampaign,
      inputData: { template_instance: template }
    })
  }

  const handleSuperCampaignConfirm = async (
    formValues: SuperCampaignFormValues
  ) => {
    await mutateAsync({ superCampaign, inputData: formValues })
    closeDrawer()
  }

  return (
    <SuperCampaignCard>
      <div className={classes.section} data-test="super-campaign-details">
        <SuperCampaignCardHeader
          className={classes.title}
          title="Details"
          actionLabel={!isReadOnly ? 'Edit' : undefined}
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
          readOnly={isReadOnly}
          viewAsAdmin
        />
      )}
      <SuperCampaignDrawer
        isOpen={!!editDrawerParam && !isReadOnly}
        onClose={closeDrawer}
        formInitialValues={superCampaign}
        onConfirm={handleSuperCampaignConfirm}
        actionButtonsDisabled={isLoading}
      />
    </SuperCampaignCard>
  )
}

export default SuperCampaignOverviewDetail
