import React from 'react'

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  makeStyles,
  Typography
} from '@material-ui/core'

import DomainLoading from './DomainLoading'

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

const currencySigns = {
  USD: '$'
}

interface DomainSearchResultsProps {
  items: IDomainSuggest[]
  onSelectDomain: (domainName: string, price: string) => void
  domainName: string
  disabled: boolean
  isLoading: boolean
}

function DomainSearchResults({
  items,
  domainName,
  onSelectDomain,
  disabled,
  isLoading
}: DomainSearchResultsProps) {
  const classes = useStyles()

  return (
    <Box marginBottom={3}>
      {isLoading && !items.length && <DomainLoading />}
      <RadioGroup aria-label="Domain Name" name="domainName" value={domainName}>
        {items.map(item => {
          const price =
            (currencySigns[item.currency] ?? ` ${item.currency}`) +
            item.price / 1000000

          return (
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
                    {price}
                  </Typography>
                </Box>
              }
              disabled={disabled || isLoading}
              onChange={() => onSelectDomain(item.domain, price)}
            />
          )
        })}
      </RadioGroup>
    </Box>
  )
}

export default DomainSearchResults
