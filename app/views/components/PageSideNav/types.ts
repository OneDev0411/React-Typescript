import { CSSProperties } from '@material-ui/styles'

export enum SectionsEnum {
  Link = 'link',
  List = 'list'
}

export interface SectionItem {
  title: string
  value?: IMarketingTemplateType | IMarketingTemplateType[]
  link: string
  isIndex?: boolean
  icon?: React.ComponentType
  access?: IPermission[]
}

export interface Section {
  type: SectionsEnum
  title: string
  value?: string | null
  items: SectionItem[]
  access?: IPermission[]
}

interface SelectableListSection {
  type: SectionsEnum.List
  title?: string
  items: {
    title: string
    link: string
  }[]
}

export interface LinkListSection {
  type: SectionsEnum.Link
  title?: string
  items: SideNavItemProps[]
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

type SectionsType = SelectableListSection | LinkListSection

export interface PageSideNavProps {
  isOpen: boolean
  width: CSSProperties['width']
  sections?: SectionsType[]
  children?: React.ReactNode
}
