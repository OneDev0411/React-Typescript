import { Box, Button } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

interface Props {
  hasAlert: boolean
}

export const TriggerableInlineEditLoading = ({ hasAlert = false }: Props) => {
  return (
    <Box display="flex" flexDirection="column" padding={1}>
      {hasAlert && (
        <Box mb={2}>
          <Skeleton variant="rect" width="100%" height={68} />
        </Box>
      )}
      <Box
        width="100%"
        display="flex"
        flexDirection="row"
        alignItems="stretch"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width={305}
          pr={1}
        >
          <Box mb={1} width="50%">
            <Skeleton variant="text" />
          </Box>
          <Box mb={1} width="100%">
            <Skeleton variant="rect" height={40} />
          </Box>
          <Box mb={2} width="100%">
            <Skeleton variant="rect" height={42} />
          </Box>
          <Box mb={1} width="100%">
            <Skeleton variant="text" height={24} />
          </Box>
          <Box mb={2} width="100%">
            <Skeleton variant="rect" height={68} />
          </Box>
          <Box mb={1} width="100%">
            <Skeleton variant="rect" height={40} />
          </Box>
          <Box width="100%">
            <Skeleton variant="rect" height={40} />
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" width={305} pl={1}>
          <Skeleton variant="text" />
          <Box mt={1}>
            <Skeleton height="440px" variant="rect" />
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row-reverse"
        mt={2}
        alignItems="center"
      >
        <Button
          variant="contained"
          color="secondary"
          size="small"
          disabled
          data-test="inline-editable-field-save"
        >
          Save
        </Button>
        <Box marginRight={2}>
          <Button size="small" disabled>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
