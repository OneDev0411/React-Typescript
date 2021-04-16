import { Tab, DropdownTab } from 'components/PageTabs'
import { MenuItem } from '@material-ui/core'
import { withRouter, WithRouterProps } from 'react-router'
import { useSelector } from 'react-redux'

import { hasUserAccess } from '../../../../../../utils/user-teams'
import { ACL } from '../../../../../../constants/acl'

import dashboards from '../dashboards'

const AnalyticsDropdown = withRouter((props: Props & WithRouterProps) => {
  const { brand_type } = props

  const availDashboards = dashboards[brand_type]

  if (!availDashboards) {
    return null
  }

  const { user } = useSelector(({ user }: IAppState) => ({
    user
  }))

  const hasAccess = hasUserAccess(user, ACL.BETA)

  if (!hasAccess) {
    return null
  }

  return (
    <Tab
      value="analytics"
      label={
        <DropdownTab title='Analytics'>
          {({ toggleMenu }) => (
            <>
              {...Object.keys(availDashboards).map((key, index) =>
                <MenuItem
                  key={index}
                  onClick={() => {
                    toggleMenu()
                    props.router.push(
                      `/dashboard/deals/analytics/${key}`
                    )
                  }}
                >
                  {availDashboards[key].label}
                </MenuItem>
              )}
            </>
          )}
        </DropdownTab>
      }
    />
  )
})

export default AnalyticsDropdown
