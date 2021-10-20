import { useState, useMemo } from 'react'

import { Box, List, ListItem } from '@material-ui/core'
import matchSorter from 'match-sorter'
import { useSelector } from 'react-redux'

import { IAppState } from '@app/reducers'
import { selectForms } from '@app/reducers/deals/forms'
import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'
import { SearchInput } from 'components/GlobalHeaderWithSearch'

interface Props {
  deal: IDeal
  onSelectForm: ({ form: UUID, title: string, taskType: IDealTaskType }) => void
}

export function FormTask({ deal, onSelectForm }: Props) {
  const [searchFilter, setSearchFilter] = useState('')

  const forms = useSelector<IAppState, Record<UUID, IDealForm>>(
    ({ deals }) => selectForms(deals.forms, deal.id) || {}
  )

  const filteredForms = useMemo(() => {
    return searchFilter
      ? matchSorter(Object.values(forms), searchFilter, {
          keys: ['name']
        })
      : Object.values(forms)
  }, [forms, searchFilter])

  const handleCreate = (form: IDealForm) => {
    onSelectForm({
      taskType: 'Form',
      title: form.name,
      form: form.id
    })
  }

  return (
    <>
      <Box my={1}>
        <SearchInput
          fullWidth
          placeholder="Type in to search..."
          value={searchFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchFilter(e.target.value)
          }
        />
      </Box>

      <List>
        {filteredForms.map(form => (
          <ListItem
            button
            key={`${form.id}`}
            onClick={() => handleCreate(form)}
          >
            <TextMiddleTruncate text={form.name} maxLength={70} />
          </ListItem>
        ))}
      </List>
    </>
  )
}
