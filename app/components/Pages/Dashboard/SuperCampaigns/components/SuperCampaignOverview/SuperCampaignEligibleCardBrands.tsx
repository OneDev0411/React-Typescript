import { Button } from '@material-ui/core'

import useSafeState from '@app/hooks/use-safe-state'
import { MultiSelectionBrandSelectorDrawer } from '@app/views/components/BrandSelector'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
import { useSuperCampaignDetail } from '../SuperCampaignDetailProvider'

import { useUpdateSuperCampaignEligibility } from './use-update-super-campaign-eligibility'

function SuperCampaignEligibleCardBrands() {
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useSafeState(false)

  const { superCampaign, setSuperCampaign } = useSuperCampaignDetail()
  const isSuperCampaignReadOnly = useIsSuperCampaignReadOnly(superCampaign)

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
    <>
      <Button
        color="primary"
        size="small"
        disabled={isSuperCampaignReadOnly}
        onClick={openBrandSelector}
      >
        {eligibleBrands.length !== 1
          ? `${eligibleBrands.length} offices & teams have `
          : '1 office or team has '}
        been selected
      </Button>
      {isBrandSelectorOpen && (
        <MultiSelectionBrandSelectorDrawer
          open
          width="43rem"
          disabled={isSuperCampaignReadOnly}
          selectedBrands={eligibleBrands}
          onClose={closeBrandSelector}
          onSave={handleSelectedBrandSave}
          drawerTitle="Select Offices or Teams"
        />
      )}
    </>
  )
}

export default SuperCampaignEligibleCardBrands
