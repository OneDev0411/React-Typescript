import { Avatar, ListItemText, ListItemAvatar } from '@material-ui/core'

interface Props {
  agent: IAgent
  primaryText: React.ReactNode
}

export function AgentRow({ agent, primaryText }: Props) {
  return (
    <>
      <ListItemAvatar>
        <Avatar src={agent.profile_image_url!} />
      </ListItemAvatar>
      <ListItemText
        primary={primaryText}
        secondary={agent.mlsid || agent.email}
      />
    </>
  )
}
