import { IconButton } from '@material-ui/core'
import { mdiFacebook, mdiInstagram, mdiLinkedin } from '@mdi/js'

import { mdiPinterestPath } from '@app/views/components/SvgIcons/Pinterest/iconPinterest'
import { mdiTikTokPath } from '@app/views/components/SvgIcons/Tiktok/iconTiktok'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { SocialMediasType, SocialMediasEnum } from './types'

interface MiniContactIconsType {
  socials?: SocialMediasType[]
}

function MiniContactIcons(props: MiniContactIconsType) {
  if (!props.socials) {
    return null
  }

  return (
    <div className="person-socials">
      {props.socials.map(social => {
        switch (social.type) {
          case SocialMediasEnum.facebook:
            return (
              <IconButton
                href={social.url}
                target="_blank"
                key={social.type}
                size="small"
              >
                <SvgIcon path={mdiFacebook} />
              </IconButton>
            )
          case SocialMediasEnum.instagram:
            return (
              <IconButton
                href={social.url}
                target="_blank"
                key={social.type}
                size="small"
              >
                <SvgIcon path={mdiInstagram} />
              </IconButton>
            )
          case SocialMediasEnum.linkedin:
            return (
              <IconButton
                href={social.url}
                target="_blank"
                key={social.type}
                size="small"
              >
                <SvgIcon path={mdiLinkedin} />
              </IconButton>
            )
          case SocialMediasEnum.pinterest:
            return (
              <IconButton
                href={social.url}
                target="_blank"
                key={social.type}
                size="small"
              >
                <SvgIcon path={mdiPinterestPath} />
              </IconButton>
            )
          case SocialMediasEnum.tiktok:
            return (
              <IconButton
                href={social.url}
                target="_blank"
                key={social.type}
                size="small"
              >
                <SvgIcon path={mdiTikTokPath} />
              </IconButton>
            )
        }
      })}
    </div>
  )
}

export default MiniContactIcons
