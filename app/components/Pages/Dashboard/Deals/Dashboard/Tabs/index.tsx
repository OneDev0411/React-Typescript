import { Box, makeStyles } from '@material-ui/core'

import { PageTabs, TabLink } from 'components/PageTabs'

import FoldersPane from './Panes/Folders'
import MarketingPane from './Panes/Marketing'
import MediaManagerPane from './Panes/MediaManager'

import Notifications from '../Notifications'

const useStyles = makeStyles(
  () => ({
    tabs: {
      backgroundColor: '#fff'
    }
  }),
  {
    name: 'Deal-DashboardTabs'
  }
)

interface Props {
  deal: IDeal
  user: IUser
  activeTab: string
  isBackOffice: boolean
  isFetchingChecklists: boolean
  isFetchingContexts: boolean
  onChangeTab: (id: string) => void
}

const tabs = [
  {
    id: 'checklists',
    label: 'Checklists',
    render: (props: Props) => <FoldersPane {...props} />
  },
  {
    id: 'photos',
    label: 'Photos',
    render: (props: Props) => <MediaManagerPane {...props} />
  },
  {
    id: 'marketing',
    label: 'Marketing',
    render: (props: Props) => <MarketingPane {...props} />
  }
]

export default function Tabs(props: Props) {
  const classes = useStyles()
  const tab = tabs.find(tab => tab.id === props.activeTab)

  return (
    <Box>
      <Box px={5} className={classes.tabs}>
        <PageTabs
          defaultValue={tab?.id}
          onChange={props.onChangeTab}
          containerStyle={{
            marginBottom: 0
          }}
          tabs={tabs.map(({ id, label }) => (
            <TabLink
              key={id}
              label={label}
              to={`/dashboard/deals/${props.deal.id}/${id}`}
              value={id}
            />
          ))}
        />
      </Box>

      <Notifications deal={props.deal} />

      {tabs.map(item => (
        <Box
          key={item.id}
          px={5}
          py={2}
          display="flex"
          style={{
            display: item.id === tab?.id ? 'block' : 'none'
          }}
        >
          {item.render(props)}
        </Box>
      ))}
    </Box>
  )
}
