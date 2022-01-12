import { Card, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import iff from '@app/utils/iff'
import TemplateThumbnail from 'components/TemplateThumbnail'

const useStyles = makeStyles(
  {
    readOnly: { pointerEvents: 'none' }
  },
  { name: 'SuperCampaignTemplatePreview' }
)

interface SuperCampaignTemplatePreviewProps {
  className?: string
  template: IMarketingTemplateInstance
  onClick?: () => void
  readOnly: boolean
}

function SuperCampaignTemplatePreview({
  className,
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
      className={classNames(className, iff(readOnly, classes.readOnly))}
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
