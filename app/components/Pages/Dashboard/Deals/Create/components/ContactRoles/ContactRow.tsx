import {
  ListItem,
  Avatar,
  ListItemText,
  ListItemAvatar
} from '@material-ui/core'

import { convertContactToRole } from '../../../utils/roles'
import { IDealFormRole } from '../../types'

interface Props {
  index: number
  style: React.CSSProperties
  data: {
    options: IContact[]
    getHighlightedText: (text: string, highlight: string) => React.ReactNode
    inputValue: string
    getOptionProps: ({
      option,
      index
    }: {
      option: IContact
      index: number
    }) => {}
    onSelectRole: (role: Partial<IDealFormRole>) => void
  }
}

export function ContactRow({
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
      onClick={() => onSelectRole(convertContactToRole(option))}
    >
      <ListItemAvatar>
        <Avatar src={option.profile_image_url!} />
      </ListItemAvatar>
      <ListItemText
        primary={getHighlightedText(option.display_name, inputValue)}
        secondary={option.email}
      />
    </ListItem>
  )
}
