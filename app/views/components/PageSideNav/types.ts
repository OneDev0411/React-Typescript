import { CSSProperties } from '@material-ui/styles'

export enum SectionsEnum {
  LINK = 'link',
  SELECTABLE_LIST = 'list'
}

interface SelectableListSection {
  type: SectionsEnum.SELECTABLE_LIST
  title?: string
  items: {
    title: string
    link: string
  }[]
}

export interface SideNavItemProps {
  // Without this, it's really hard to detect whether user is on a url or not.
  isIndex?: boolean
  icon?: React.FC<any>
  title: string
  link?: string
  badge?: number
  isSelected?: boolean
  tooltip?: string
  onDelete?: () => void
}

export interface LinkListSection {
  type: SectionsEnum.LINK
  title?: string
  items: SideNavItemProps[]
}

type SectionsType = SelectableListSection | LinkListSection

export interface PageSideNavProps {
  isOpen: boolean
  width: CSSProperties['width']
  sections?: SectionsType[]
  children?: React.ReactNode
}
