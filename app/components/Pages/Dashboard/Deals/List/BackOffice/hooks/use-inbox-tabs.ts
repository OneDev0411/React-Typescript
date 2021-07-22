import _ from 'underscore'

export function useInboxTabs(deals: IDeal[]): Nullable<string>[] {
  return _.chain(deals)
    .pluck('inboxes')
    .flatten()
    .uniq()
    .filter(tab => !!tab)
    .value()
}
