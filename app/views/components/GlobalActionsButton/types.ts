import { ComponentProps, ReactNode } from 'react'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { EventDrawer } from 'components/EventDrawer'
import NewContactDrawer from 'components/CreateContact/NewContactDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'

import CreateOpenHouse from './OpenHouse'

export type ItemType =
  | 'email'
  | 'event'
  | 'contact'
  | 'deal'
  | 'openhouse'
  | 'tour'

interface BaseItem<T extends ItemType> {
  title: string
  type: T
  Icon: React.FC<any>
}

interface EmailItem extends BaseItem<'email'> {
  render(props: ComponentProps<typeof SingleEmailComposeDrawer>): ReactNode
}

interface EventItem extends BaseItem<'event'> {
  render(props: ComponentProps<typeof EventDrawer>): ReactNode
}

interface ContactItem extends BaseItem<'contact'> {
  render(props: ComponentProps<typeof NewContactDrawer>): ReactNode
}

interface DealItem extends BaseItem<'deal'> {
  redirectTo(url: string): void
}

interface OpenHouseItem extends BaseItem<'openhouse'> {
  render(props: ComponentProps<typeof CreateOpenHouse>): ReactNode
}

interface TourItem extends BaseItem<'tour'> {
  render(props: ComponentProps<typeof TourDrawer>): ReactNode
}

export type Item =
  | EmailItem
  | EventItem
  | ContactItem
  | DealItem
  | OpenHouseItem
  | TourItem
