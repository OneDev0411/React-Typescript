import { MenuItem } from '@material-ui/core'
import { browserHistory } from 'react-router'

import { Tab, DropdownTab } from 'components/PageTabs'

import dashboards from 'constants/metabase'

interface Props {
  brandType: IBrandType
}

const AnalyticsDropdown = ({ brandType }: Props) => {
  const availableDashboards = dashboards[brandType]

  if (!availableDashboards) {
    return null
  }

  return (
    <Tab
      value="analytics"
      key="analytics"
      label={
        <DropdownTab title="Analytics">
          {({ toggleMenu }) => (
            <>
              {...Object.keys(availableDashboards).map((key, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    toggleMenu()
                    browserHistory.push(`/dashboard/deals/analytics/${key}`)
                  }}
                >
                  {availableDashboards[key].label}
                </MenuItem>
              ))}
            </>
          )}
        </DropdownTab>
      }
    />
  )
}

export default AnalyticsDropdown
