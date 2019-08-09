import React from 'react'

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
              <a href={social.url} target="_blank" key={social.type}>
                <IconFacebook width={24} height={24} />
              </a>
            )
          case SocialMediasEnum.instagram:
            return (
              <a href={social.url} target="_blank" key={social.type}>
                <IconInstagram width={24} height={24} />
              </a>
            )
          case SocialMediasEnum.linkedin:
            return (
              <a href={social.url} target="_blank" key={social.type}>
                <IconLinkedIn width={24} height={24} />
              </a>
            )
        }
      })}
    </div>
  )
}

export default MiniContactIcons
