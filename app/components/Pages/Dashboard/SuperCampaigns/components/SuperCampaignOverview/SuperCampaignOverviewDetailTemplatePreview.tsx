import { Card } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import TemplateThumbnail from 'components/TemplateThumbnail'

interface SuperCampaignOverviewDetailTemplatePreviewProps {
  templateInstance: IMarketingTemplateInstance
  onClick: () => void
}

function SuperCampaignOverviewDetailTemplatePreview({
  templateInstance,
  onClick
}: SuperCampaignOverviewDetailTemplatePreviewProps) {
  const user = useSelector(selectUser)
  const brand = useSelector(selectActiveBrand)

  return (
    <Card variant="outlined">
      <TemplateThumbnail
        template={templateInstance}
        brand={brand}
        data={{
          user,
          listing: templateInstance.listings?.[0],
          contact: templateInstance.contacts?.[0]
          // TODO: ask Emil about the listings, deals, and contacts
        }}
        onClick={onClick}
      />
    </Card>
  )
}

export default SuperCampaignOverviewDetailTemplatePreview
