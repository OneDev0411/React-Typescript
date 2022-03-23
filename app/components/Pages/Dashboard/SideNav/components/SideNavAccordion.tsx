import { ChangeEvent, Dispatch, SetStateAction } from 'react'

import Acl from '@app/views/components/Acl'

import { AccordionMenu, ExpandedMenu } from '../types'

import SideNavAccordionItem from './SideNavAccordionItem'

interface SideNavAccordionProps {
  data: AccordionMenu
  expandedMenu: ExpandedMenu
  onChange: (
    panel: ExpandedMenu
  ) => (event: ChangeEvent<{}>, isExpanded: boolean) => void
  setExpandedMenu: Dispatch<SetStateAction<ExpandedMenu>>
}

export default function SideNavAccordion({
  data,
  expandedMenu,
  onChange,
  setExpandedMenu
}: SideNavAccordionProps) {
  const { access } = data

  return access ? (
    <Acl access={access}>
      <SideNavAccordionItem
        data={data}
        onChange={onChange}
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
      />
    </Acl>
  ) : (
    <SideNavAccordionItem
      data={data}
      onChange={onChange}
      expandedMenu={expandedMenu}
      setExpandedMenu={setExpandedMenu}
    />
  )
}
