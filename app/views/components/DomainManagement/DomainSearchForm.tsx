import React, { ChangeEvent, FormEvent, useState } from 'react'

import { Box, TextField, Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    button: { minWidth: theme.spacing(13) }
  }),
  { name: 'DomainSearchForm' }
)

interface DomainSearchFormProps {
  disabled: boolean
  isLoading: boolean
  onSubmit: (search: string) => void
}

function DomainSearchForm({
  onSubmit,
  disabled,
  isLoading
}: DomainSearchFormProps) {
  const classes = useStyles()
  const [search, setSearch] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(search)
  }

  return (
    <form onSubmit={handleSearch}>
      <Box display="flex" alignItems="flex-end" marginBottom={3}>
        <TextField
          aria-label="Domain Name"
          label="Domain Name"
          fullWidth
          placeholder="yourdomain.com"
          type="text"
          onChange={handleChange}
          value={search}
          disabled={disabled}
          size="medium"
          name="domain"
          autoFocus
        />
        <Box marginLeft={1}>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            disabled={!search.length || disabled}
            type="submit"
          >
            Search{isLoading ? 'ing...' : ''}
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default DomainSearchForm
