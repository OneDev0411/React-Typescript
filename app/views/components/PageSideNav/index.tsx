import React from 'react'
import { Typography, MenuItem, Box } from '@material-ui/core'
import { browserHistory } from 'react-router'

import { isOnThisUrl } from './helpers'
import { SideNavContainer } from './styled'

interface PageSideNav {
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
  children?: React.ReactNode
}

function PageSideNav(props: PageSideNav) {
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
                  <Box display="flex" alignItems="center">
                    {item.icon && (
                      <Box mr={1} lineHeight={1} className="section-item__icon">
                        <item.icon />
                      </Box>
                    )}
                    <Typography variant="body2" component="span">
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" component="span">
                    {item.badge}
                  </Typography>
                </MenuItem>
              )
            })}
          </section>
        )
      })}
      {props.children && (
        <div className="SideNav-direct-child">{props.children}</div>
      )}
    </SideNavContainer>
  )
}

export default PageSideNav
