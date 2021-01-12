import React, { ChangeEvent, FormEvent } from 'react'
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  makeStyles,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    label: {
      flexGrow: 1,
      overflow: 'hidden'
    },
    price: {
      color: theme.palette.grey[400],
      flexShrink: 0
    }
  }),
  { name: 'DomainSearchResults' }
)

interface DomainSearchResultsProps {
  items: IDomainSuggest[]
  onSelectDomain: (domainName: string) => void
  domainName: string
  onCheckoutClick: () => void
  disabled: boolean
}

function DomainSearchResults({
  items,
  domainName,
  onSelectDomain,
  onCheckoutClick,
  disabled
}: DomainSearchResultsProps) {
  const classes = useStyles()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectDomain(event.target.value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (domainName) {
      onCheckoutClick()
    }
  }

  if (!items.length) {
    return null
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box marginBottom={3}>
        <RadioGroup
          aria-label="Domain Name"
          name="domainName"
          onChange={handleChange}
          value={domainName}
        >
          {items.map(item => (
            <FormControlLabel
              key={item.domain}
              value={item.domain}
              control={<Radio />}
              classes={{ label: classes.label }}
              label={
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>{item.domain}</Box>
                  <Typography className={classes.price} variant="caption">
                    {item.price / 1000000} {item.currency}
                  </Typography>
                </Box>
              }
              disabled={disabled}
            />
          ))}
        </RadioGroup>
      </Box>
      <Box>
        <Button
          variant="contained"
          color="secondary"
          disabled={!domainName}
          type="submit"
        >
          Continue to checkout
        </Button>
      </Box>
    </form>
  )
}

export default DomainSearchResults
