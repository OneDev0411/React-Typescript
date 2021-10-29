import { Card, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import TemplateThumbnail from 'components/TemplateThumbnail'

const useStyles = makeStyles(
  {
    readOnly: { pointerEvents: 'none' }
  },
  { name: 'SuperCampaignTemplatePreview' }
)

interface SuperCampaignTemplatePreviewProps {
  template: IMarketingTemplateInstance
  onClick: () => void
  readOnly: boolean
}

function SuperCampaignTemplatePreview({
  template,
  onClick,
  readOnly
}: SuperCampaignTemplatePreviewProps) {
  const classes = useStyles()

  const user = useSelector(selectUser)
  const brand = useSelector(selectActiveBrand)

  return (
    <Card
      variant="outlined"
      className={readOnly ? classes.readOnly : undefined}
    >
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
