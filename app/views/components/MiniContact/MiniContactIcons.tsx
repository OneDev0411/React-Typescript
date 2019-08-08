import React from 'react'

import IconFacebook from 'components/SvgIcons/Facebook/IconFacebook'
import IconLinkedIn from 'components/SvgIcons/LinkedIn/IconLinkedIn'
import IconInstagram from 'components/SvgIcons/Instagram/IconInstagram'

import { SocialMediasType } from './useProfile'
import { SocialMediasEnum } from './types'

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
              <a href={social.url} target="_blank">
                <IconFacebook width={24} height={24} />
              </a>
            )
          case SocialMediasEnum.instagram:
            return (
              <a href={social.url} target="_blank">
                <IconInstagram width={24} height={24} />
              </a>
            )
          case SocialMediasEnum.linkedin:
            return (
              <a href={social.url} target="_blank">
                <IconLinkedIn width={24} height={24} />
              </a>
            )
        }
      })}
    </div>
  )
}

export default MiniContactIcons
