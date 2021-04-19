import { Box, makeStyles, Theme } from '@material-ui/core'

import { PageTabs, TabLink } from 'components/PageTabs'

import FoldersPane from './Panes/Folders'
import MarketingPane from './Panes/Marketing'
import MediaManagerPane from './Panes/MediaManager'

import Notifications from '../Notifications'

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

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      backgroundColor: '#f9fafc' // TODO: use palette
    }
  }),
  {
    name: 'DealsDashboard-TabsContainer'
  }
)

export default function Tabs(props: Props) {
  const classes = useStyles()
  const tab = tabs.find(tab => tab.id === props.activeTab)

  return (
    <Box>
      <Box mx={5}>
        <PageTabs
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

      {tab && (
        <Box px={5} py={2} display="flex" className={classes.container}>
          {tab.render(props)}
        </Box>
      )}
    </Box>
  )
}
