import { mdiEmailOutline } from '@mdi/js'

import { Avatar } from 'components/Avatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  item: IEmailCampaign<'template'>
}

export function ThumbnailColumn({ item }: Props) {
  return (
    <Avatar email={item} size="large">
      <SvgIcon path={mdiEmailOutline} />
    </Avatar>
  )
}
