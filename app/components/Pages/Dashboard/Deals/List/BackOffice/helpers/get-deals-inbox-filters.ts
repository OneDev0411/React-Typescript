import _ from 'underscore'

export function extractDealsInboxFilters(deals: IDeal): string[] {
  return _.chain(deals)
    .pluck('inboxes')
    .flatten()
    .uniq()
    .filter(tab => !!tab)
    .value()
}
