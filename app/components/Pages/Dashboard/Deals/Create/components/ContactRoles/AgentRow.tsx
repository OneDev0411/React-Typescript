import {
  ListItem,
  Avatar,
  ListItemText,
  ListItemAvatar
} from '@material-ui/core'

import { convertAgentToRole } from '../../../utils/roles'
import { IDealFormRole } from '../../types'

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    options: IAgent[]
    getHighlightedText: (text: string, highlight: string) => React.ReactNode
    inputValue: string
    getOptionProps: ({ option, index }: { option: IAgent; index: number }) => {}
    onSelectRole: (role: Partial<IDealFormRole>) => void
  }
}

export function AgentRow({
  index,
  style,
  data: {
    options,
    getHighlightedText,
    inputValue,
    getOptionProps,
    onSelectRole
  }
}: Props) {
  const option = options[index]

  return (
    <ListItem
      {...getOptionProps({ option, index })}
      style={style}
      onClick={() => onSelectRole(convertAgentToRole(option))}
    >
      <ListItemAvatar>
        <Avatar src={option.profile_image_url!} />
      </ListItemAvatar>
      <ListItemText
        primary={getHighlightedText(option.full_name, inputValue)}
        secondary={option.mlsid || option.email}
      />
    </ListItem>
  )
}
