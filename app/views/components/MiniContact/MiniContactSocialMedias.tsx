import React from 'react'
import { IconButton } from '@material-ui/core'

import IconFacebook from 'components/SvgIcons/Facebook/IconFacebook'
import IconLinkedIn from 'components/SvgIcons/LinkedIn/IconLinkedIn'
import IconInstagram from 'components/SvgIcons/Instagram/IconInstagram'

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
                <IconFacebook width={24} height={24} />
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
                <IconInstagram width={24} height={24} />
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
                <IconLinkedIn width={24} height={24} />
              </IconButton>
            )
        }
      })}
    </div>
  )
}

export default MiniContactIcons
