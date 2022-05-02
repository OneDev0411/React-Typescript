import { Dispatch, SetStateAction } from 'react'

import Acl from '@app/views/components/Acl'

import { AccordionMenu, ExpandedMenu } from '../types'

import SideNavAccordionItem from './SideNavAccordionItem'

interface SideNavAccordionProps {
  data: AccordionMenu
  expandedMenu: ExpandedMenu
  onExpandMenu: Dispatch<SetStateAction<ExpandedMenu>>
}

export default function SideNavAccordion({
  data,
  expandedMenu,
  onExpandMenu
}: SideNavAccordionProps) {
  const { access } = data

  return access ? (
    <Acl access={access}>
      <SideNavAccordionItem
        data={data}
        expandedMenu={expandedMenu}
        onExpandMenu={onExpandMenu}
      />
    </Acl>
  ) : (
    <SideNavAccordionItem
      data={data}
      expandedMenu={expandedMenu}
      onExpandMenu={onExpandMenu}
    />
  )
}
