import { Card, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { selectActiveBrand } from '@app/selectors/brand'
import { selectUser } from '@app/selectors/user'
import TemplateThumbnail from 'components/TemplateThumbnail'

import { getCorrectedUser } from './helpers'

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
  viewAsAdmin?: boolean
}

function SuperCampaignTemplatePreview({
  className,
  template,
  onClick,
  readOnly,
  viewAsAdmin = false
}: SuperCampaignTemplatePreviewProps) {
  const classes = useStyles()

  const user = useSelector(selectUser)
  const brand = useSelector(selectActiveBrand)

  const correctedUser = getCorrectedUser(user, viewAsAdmin)

  return (
    <Card
      variant="outlined"
      className={classNames(className, readOnly && classes.readOnly)}
    >
      <TemplateThumbnail
        template={template}
        brand={brand}
        data={{
          user: correctedUser,
          sender: correctedUser,
          listing: template.listings?.[0],
          contact: template.contacts?.[0]
        }}
        onClick={onClick}
      />
    </Card>
  )
}

export default SuperCampaignTemplatePreview
