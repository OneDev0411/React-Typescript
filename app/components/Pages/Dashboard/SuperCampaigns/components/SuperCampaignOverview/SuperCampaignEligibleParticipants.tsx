import { Typography, Button, makeStyles } from '@material-ui/core'

import useSafeState from '@app/hooks/use-safe-state'
import { MultiSelectionBrandSelectorDrawer } from '@app/views/components/BrandSelector'

import { useIsSuperCampaignExecutedOrDueAtTimeout } from '../../hooks/use-is-super-campaign-executed-or-due-at-timeout'
import SuperCampaignCard, { SuperCampaignCardProps } from '../SuperCampaignCard'
import SuperCampaignCardHeader from '../SuperCampaignCardHeader'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import { useUpdateSuperCampaignEligibility } from './use-update-super-campaign-eligibility'

const useStyles = makeStyles(
  theme => ({
    subtitle: { color: theme.palette.grey[500] },
    actions: { marginTop: theme.spacing(1.5) }
  }),
  { name: 'SuperCampaignEligibleParticipants' }
)

type SuperCampaignEligibleParticipantsProps = SuperCampaignCardProps

function SuperCampaignEligibleParticipants(
  props: SuperCampaignEligibleParticipantsProps
) {
  const classes = useStyles()
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useSafeState(false)

  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()
  const isCampaignExecutedOrDueAtTimeout =
    useIsSuperCampaignExecutedOrDueAtTimeout(superCampaign)

  const updateSuperCampaignEligibility = useUpdateSuperCampaignEligibility(
    superCampaign,
    setSuperCampaign
  )

  const openBrandSelector = () => setIsBrandSelectorOpen(true)

  const closeBrandSelector = () => setIsBrandSelectorOpen(false)

  const handleSelectedBrandSave = async (brandsId: UUID[]) => {
    await updateSuperCampaignEligibility(brandsId)
    closeBrandSelector()
  }

  const eligibleBrands: UUID[] = superCampaign.eligible_brands ?? []

  return (
    <SuperCampaignCard {...props}>
      <SuperCampaignCardHeader title="Eligible Participants" />
      <Typography className={classes.subtitle} variant="body2">
        Add offices and teams which are eligible to participate to this
        campaign.
      </Typography>
      <div className={classes.actions}>
        {eligibleBrands.length === 0 ? (
          <Button
            color="primary"
            variant="contained"
            size="small"
            disabled={isCampaignExecutedOrDueAtTimeout}
            onClick={openBrandSelector}
          >
            Add Eligible Offices & Teams
          </Button>
        ) : (
          <>
            <Typography variant="subtitle2" component="span">
              {eligibleBrands.length > 1
                ? `${eligibleBrands.length} offices & teams have `
                : '1 office or team has '}
              been selected
            </Typography>
            <Button color="primary" size="small" onClick={openBrandSelector}>
              {isCampaignExecutedOrDueAtTimeout
                ? 'View Offices or Teams'
                : 'Edit'}
            </Button>
          </>
        )}
      </div>
      {isBrandSelectorOpen && (
        <MultiSelectionBrandSelectorDrawer
          open
          width="43rem"
          disabled={isCampaignExecutedOrDueAtTimeout}
          selectedBrands={eligibleBrands}
          onClose={closeBrandSelector}
          onSave={handleSelectedBrandSave}
          drawerTitle="Select Offices or Teams"
        />
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignEligibleParticipants
