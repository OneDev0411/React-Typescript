import _ from 'underscore'

export function useInboxTabs(deals: IDeal[]): (string | null)[] {
  return _.chain(deals)
    .pluck('inboxes')
    .flatten()
    .uniq()
    .filter(tab => !!tab)
    .value()
}
