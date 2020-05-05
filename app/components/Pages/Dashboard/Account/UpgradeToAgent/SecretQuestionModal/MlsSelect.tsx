import React from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  makeStyles,
  Theme
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  select: {
    width: 180
  }
}))

interface Props {
  items: IAgent[]
  onCancel: () => void
  onChange: (event) => void
  mlsId: string
  defaultValue: IAgent
}

export function MlsSelect({
  items,
  onChange,
  mlsId,
  defaultValue,
  onCancel
}: Props) {
  const classes = useStyles()

  return (
    <>
      <div>
        <Box mb={3}>
          <Typography variant="h4">Choose MLS</Typography>
          <Box mb={1} />
          <Typography>
            {`You entred ${mlsId} for MLS #, Choose which MLS you are in.`}
          </Typography>
        </Box>
        <FormControl variant="filled" color="secondary">
          <InputLabel id="select-mls">MLS</InputLabel>
          <Select
            labelId="select-mls"
            id="select-mls"
            defaultValue={defaultValue.id}
            onChange={onChange}
            classes={{ root: classes.select }}
          >
            {items.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.mls}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Box display="flex" justifyContent="flex-end">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </>
  )
}
