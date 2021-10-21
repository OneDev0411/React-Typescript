import { useState } from 'react'

import { Typography, Button, makeStyles } from '@material-ui/core'

import TeamTreeViewDrawer from '@app/views/components/TeamTreeView/Drawer'

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
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState(false)

  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()

  const updateSuperCampaignEligibility = useUpdateSuperCampaignEligibility(
    superCampaign,
    setSuperCampaign
  )

  const openBrandSelector = () => setIsBrandSelectorOpen(true)

  const closeBrandSelector = () => setIsBrandSelectorOpen(false)

  const saveSelectedBrands = async (team: IBrand) => {
    await updateSuperCampaignEligibility([team.id])
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
              Edit
            </Button>
          </>
        )}
      </div>
      {/* TODO: use multi brand selector here */}
      {isBrandSelectorOpen && (
        <TeamTreeViewDrawer
          title="Select Offices or Teams"
          onClose={closeBrandSelector}
          onSelectTeam={saveSelectedBrands}
        />
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignEligibleParticipants
