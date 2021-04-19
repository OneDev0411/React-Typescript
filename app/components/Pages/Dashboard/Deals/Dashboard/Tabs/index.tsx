import { Box } from '@material-ui/core'

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

export default function Tabs(props: Props) {
  const tab = tabs.find(tab => tab.id === props.activeTab)

  return (
    <Box mx={5}>
      <Box mb={1}>
        <PageTabs
          defaultValue={props.activeTab}
          onChange={props.onChangeTab}
          tabs={tabs.map(({ id, label }, i) => (
            <TabLink
              key={i}
              label={label}
              to={`/dashboard/deals/${props.deal.id}/${id}`}
              value={id}
            />
          ))}
        />
      </Box>

      <Notifications deal={props.deal} />

      {tab && <Box display="flex">{tab.render(props)}</Box>}
    </Box>
  )
}
