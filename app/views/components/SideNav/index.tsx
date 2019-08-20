import React from 'react'
import { Typography, MenuItem } from '@material-ui/core'
import { browserHistory } from 'react-router'

import { SideNavContainer } from './styled'
import { isOnThisUrl } from './SideNav-helpers'

interface SideNav {
  sections: {
    title?: string
    items: {
      // Without this, it's really hard to detect whether user is on a url or not.
      isIndex: boolean
      icon?: string
      title: string
      link: string
      badge: number
    }[]
  }[]
}

function SideNav(props: SideNav) {
  return (
    <SideNavContainer>
      {props.sections.map((section, secIndex) => {
        return (
          <section key={`sec-${secIndex}`}>
            <Typography variant="subtitle1" component="h6">
              {section.title}
            </Typography>
            {section.items.map((item, index) => {
              return (
                <MenuItem
                  className="section-item"
                  onClick={() => {
                    browserHistory.push(item.link)
                  }}
                  selected={isOnThisUrl(item.link, item.isIndex)}
                  key={`sec-menu-${index}`}
                >
                  <Typography variant="body2" component="span">
                    {item.title}
                  </Typography>
                </MenuItem>
              )
            })}
          </section>
        )
      })}
    </SideNavContainer>
  )
}

export default SideNav
