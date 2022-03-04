import { Button } from '@material-ui/core'
import { useSelector } from 'react-redux'

import useSafeState from '@app/hooks/use-safe-state'
import { useUpdateSuperCampaignEligibility } from '@app/models/super-campaign'
import { selectActiveBrandId } from '@app/selectors/brand'
import { BaseMultiSelectDrawer } from '@app/views/components/BrandSelector'

import { isSuperCampaignReadOnly } from '../../helpers'
import { useSuperCampaign } from '../SuperCampaignProvider'

function SuperCampaignEligibleCardBrands() {
  const activeBrandId = useSelector(selectActiveBrandId)
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useSafeState(false)

  const superCampaign = useSuperCampaign()
  const isReadOnly = isSuperCampaignReadOnly(superCampaign)

  const { mutateAsync } = useUpdateSuperCampaignEligibility({
    onSuccess: () => closeBrandSelector()
  })

  const openBrandSelector = () => setIsBrandSelectorOpen(true)

  const closeBrandSelector = () => setIsBrandSelectorOpen(false)

  const handleSelectedBrandSave = async (brandsId: UUID[]) => {
    await mutateAsync({
      superCampaignId: superCampaign.id,
      eligibleBrands: brandsId
    })
  }

  const eligibleBrands: UUID[] = superCampaign.eligible_brands ?? []

  return (
    <>
      <Button
        color="primary"
        size="small"
        disabled={isReadOnly}
        onClick={openBrandSelector}
      >
        {eligibleBrands.length !== 1
          ? `${eligibleBrands.length} offices & teams have `
          : '1 office or team has '}
        been selected
      </Button>
      {isBrandSelectorOpen && (
        <BaseMultiSelectDrawer
          open
          width="43rem"
          disabled={isReadOnly}
          selectedBrands={eligibleBrands}
          onClose={closeBrandSelector}
          onSave={handleSelectedBrandSave}
          drawerTitle="Select Offices or Teams"
          brandSelectorProps={{ rootBrandId: activeBrandId }}
        />
      )}
    </>
  )
}

export default SuperCampaignEligibleCardBrands
