import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Theme,
  Box,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
  DialogActions,
  IconButton
} from '@material-ui/core'

import cn from 'classnames'

import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import TreeView from 'components/TreeView'
import { useBrandTree } from 'components/TeamTreeView/use-brand-tree'

import { Types } from 'deals/FormEdit/utils/types'

import {
  getBrandFormTemplateValues,
  saveBrandFormTemplateValues,
  deleteBrandFormTemplateValues
} from 'models/Deal/form'

import { useDefaultValueContext } from './use-default-value-content'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      minHeight: '50vh'
    },
    node: {
      cursor: 'pointer',
      '&.selected': {
        color: theme.palette.primary.main
      }
    },
    content: {
      height: '50vh',
      overflow: 'hidden'
    },
    treeview: {
      height: '100%',
      overflow: 'auto',
      paddingRight: theme.spacing(1),
      borderRight: `1px solid ${theme.palette.divider}`
    },
    brandValues: {
      paddingLeft: theme.spacing(4)
    },
    action: {
      marginTop: theme.spacing(4),
      '& button': {
        marginRight: theme.spacing(1)
      }
    },
    divider: {
      margin: theme.spacing(3, 0)
    }
  }),
  {
    name: 'FormDefaultValuesDialog'
  }
)

interface Props {
  formId: UUID
}

export function DefaultValues({ formId }: Props) {
  const classes = useStyles()
  const [inputValue, setInputValue] = useState<string | boolean>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Nullable<IBrand>>(null)
  const [brandTemplateValues, setBrandTemplateValues] = useState<
    IFormTemplateValue[]
  >([])

  const {
    rootTeam,
    isLoading,
    getChildNodes,
    initialExpandedNodes
  } = useBrandTree()
  const { annotation, annotationType, setAnnotation } = useDefaultValueContext()

  useEffect(() => {
    if (!selectedTeam) {
      return
    }

    const load = async () => {
      try {
        const values = await getBrandFormTemplateValues(selectedTeam.id, formId)

        setBrandTemplateValues(values)
      } catch (e) {
        console.log(e)
      }
    }

    load()
  }, [selectedTeam, formId])

  useEffect(() => {
    const field = brandTemplateValues.find(
      item =>
        item.field === annotation?.fieldName && item.brand === selectedTeam?.id
    )

    field && setInputValue(field.value)
  }, [selectedTeam?.id, annotation?.fieldName, brandTemplateValues])

  useEffect(() => {
    if (rootTeam && !selectedTeam) {
      setSelectedTeam(rootTeam)
    }
  }, [rootTeam, selectedTeam])

  const handleClose = () => {
    setAnnotation(null)
    setSelectedTeam(null)
    setInputValue('')
  }

  const handleSelectTeam = (team: IBrand) => {
    setSelectedTeam(team)
    setInputValue('')
  }

  const handleSave = async () => {
    if (!selectedTeam || !annotation) {
      return
    }

    console.log(
      `Saving ${annotation.fieldName} = ${inputValue} into ${
        selectedTeam!.name
      }`
    )

    setIsSaving(true)

    try {
      const value = await saveBrandFormTemplateValues(
        selectedTeam.id,
        formId,
        annotation.fieldName,
        inputValue
      )

      const values =
        brandTemplateValues.length === 0
          ? [value]
          : brandTemplateValues.map(item =>
              item.field === annotation.fieldName ? value : item
            )

      setBrandTemplateValues(values)
    } catch (e) {
      console.log(e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedTeam || !annotation) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteBrandFormTemplateValues(
        selectedTeam.id,
        formId,
        annotation.fieldName
      )

      setBrandTemplateValues(
        brandTemplateValues.filter(item => item.field !== annotation.fieldName)
      )
      setInputValue('')
    } catch (e) {
      console.log(e)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (!annotation) {
    return null
  }

  return (
    <Dialog open fullWidth maxWidth="md" onClose={handleClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Default Value
          <IconButton onClick={handleClose}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" className={classes.content}>
          <Box flex={4} className={classes.treeview}>
            <TreeView
              selectable
              getChildNodes={getChildNodes}
              getNodeId={(team: IBrand) => team.id}
              initialExpandedNodes={initialExpandedNodes}
              renderNode={(team: IBrand) => (
                <div
                  className={cn(classes.node, {
                    selected: team.id === selectedTeam?.id
                  })}
                  onClick={() => handleSelectTeam(team)}
                >
                  {team.name}
                </div>
              )}
            />
          </Box>

          <Box flex={6} className={classes.brandValues}>
            {annotation && selectedTeam && (
              <>
                <Typography variant="h5">{selectedTeam?.name}</Typography>

                <Divider className={classes.divider} />

                {[Types.TEXT_ANNOTATION, Types.UNKNOWN_ANNOTATION].includes(
                  annotationType!
                ) && (
                  <TextField
                    label="Default Value"
                    value={inputValue}
                    fullWidth
                    variant="outlined"
                    multiline={annotation.multiLine}
                    onChange={e => setInputValue(e.target.value)}
                  />
                )}

                {[Types.CHECKBOX_ANNOTATION, Types.RADIO_ANNOTATION].includes(
                  annotationType!
                ) && (
                  <RadioGroup
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value === 'true')}
                  >
                    <FormControlLabel value control={<Radio />} label="On" />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Off"
                    />
                  </RadioGroup>
                )}
              </>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          disabled={isSaving || isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? 'Deleting' : 'Delete'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          disabled={isSaving || isDeleting}
          onClick={handleSave}
        >
          {isSaving ? 'Saving' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
