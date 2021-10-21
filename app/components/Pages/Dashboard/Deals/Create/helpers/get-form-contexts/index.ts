export function getFormContexts(
  values: Record<string, unknown>,
  deal: IDeal,
  brandChecklists: IBrandChecklist[],
  checklists: IDealChecklist[],
  checklistType: IBrandChecklist['checklist_type']
) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (value === undefined || !key.includes('context')) {
      return acc
    }

    const [, name] = key.split(':')

    const brandChecklist = brandChecklists?.filter(
      checklist =>
        checklist.checklist_type === checklistType &&
        checklist.property_type === deal.property_type?.id
    )

    const definition = brandChecklist
      .flatMap(item =>
        (item.optional_contexts || []).concat(item.required_contexts || [])
      )
      .find(item => item.key === name)

    const checklist = checklists.find(
      ({ origin, checklist_type, is_active_offer }) =>
        brandChecklist?.find(({ id }) =>
          checklist_type === 'Offer'
            ? id === origin && is_active_offer
            : id === origin
        )
    )

    if (!definition) {
      console.log(`Could not save context "${name}"`, { checklist, definition })

      return acc
    }

    return [
      ...acc,
      {
        value,
        definition: definition.id,
        checklist: checklist?.id,
        approved: definition ? definition.needs_approval : false
      }
    ]
  }, [])
}
