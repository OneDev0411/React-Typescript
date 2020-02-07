import React from 'react'

import { MenuItem } from '@material-ui/core'

import { PageTabs, Tab, TabLink, DropdownTab } from 'components/PageTabs'

interface Props {
  user: IUser
}

export const ContactsTabs = ({ user }: Props) => {
  // const currentUrl = window.location.pathname

  return (
    <PageTabs
      tabs={[
        <Tab
          key={2}
          value={2}
          label={
            <DropdownTab title="Contacts">
              {({ toggleMenu }) => (
                <>
                  <MenuItem key={0} onClick={toggleMenu}>
                    Menu 1
                  </MenuItem>
                  <MenuItem key={1} onClick={toggleMenu}>
                    Menu 2
                  </MenuItem>
                  <MenuItem key={2} onClick={toggleMenu}>
                    Menu 3
                  </MenuItem>
                </>
              )}
            </DropdownTab>
          }
        />,
        <Tab key={0} label="All" value={0} />,
        <TabLink key={1} label="Drafts" value={1} to="link" />
      ]}
    />
  )
}

export default ContactsTabs
