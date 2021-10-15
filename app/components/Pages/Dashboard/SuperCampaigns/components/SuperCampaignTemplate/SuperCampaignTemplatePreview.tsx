import { Card } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import TemplateThumbnail from 'components/TemplateThumbnail'

interface SuperCampaignTemplatePreviewProps {
  template: IMarketingTemplateInstance
  onClick: () => void
}

function SuperCampaignTemplatePreview({
  template,
  onClick
}: SuperCampaignTemplatePreviewProps) {
  const user = useSelector(selectUser)
  const brand = useSelector(selectActiveBrand)

  return (
    <Card variant="outlined">
      <TemplateThumbnail
        template={template}
        brand={brand}
        data={{
          user,
          listing: template.listings?.[0],
          contact: template.contacts?.[0]
        }}
        onClick={onClick}
      />
    </Card>
  )
}

export default SuperCampaignTemplatePreview
