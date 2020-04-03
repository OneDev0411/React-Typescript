import React, { useState, useEffect, useRef } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
  FontManager,
  FONT_FAMILY_DEFAULT,
  OPTIONS_DEFAULTS,
  Font
} from '@samuelmeuli/font-manager'

// import config from '../../../../../../../config/public'

import { FieldProps } from './types'

const API_KEY = 'AIzaSyCNY_oRs9HhkFcAyQJLQNTXWoa45jUm7sc'

function getFontId(fontFamily: string): string {
  return fontFamily.replace(/\s+/g, '-').toLowerCase()
}

export default function FontField({
  value = FONT_FAMILY_DEFAULT,
  name,
  label,
  onChange
}: FieldProps) {
  const [status, setStatus] = useState<'loading' | 'failed' | 'succeed'>(
    'loading'
  )
  const [fonts, setFonts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const fontManager = useRef<FontManager | null>(null)

  useEffect(() => {
    if (fontManager.current) {
      return
    }

    const fontManagerFilter = (font: Font): boolean => {
      if (!searchQuery) {
        return true
      }

      return searchQuery.includes(font.family)
    }

    async function initFontManager() {
      try {
        fontManager.current = new FontManager(API_KEY, FONT_FAMILY_DEFAULT, {
          ...OPTIONS_DEFAULTS,
          filter: fontManagerFilter,
          limit: 500
        })

        const iterableFonts = await fontManager.current.init()
        const allFonts = Array.from(iterableFonts.values())
        const allFontNames = allFonts.map(item => item.family)

        setFonts(allFontNames)
        setStatus('succeed')
      } catch (err) {
        setStatus('failed')
        console.error(err)
      }
    }

    initFontManager()
  }, [searchQuery])

  useEffect(() => {
    if (!fontManager.current) {
      return
    }

    fontManager.current.setOnChange((font: Font) => onChange(name, font.family))
  }, [name, onChange])

  useEffect(() => {
    if (!fontManager.current) {
      return
    }

    if (
      fontManager.current.getActiveFont().family === value ||
      !fonts.includes(value)
    ) {
      return
    }

    fontManager.current.setActiveFont(value)
  }, [value, fonts])

  const handleChange = (fontName: string) => {
    if (!fontManager.current) {
      return
    }

    setSearchQuery('')

    fontManager.current.setActiveFont(fontName)
  }

  const handleSearch = (query: string) => {
    if (!fontManager.current) {
      return
    }

    setSearchQuery(query)
  }

  if (status === 'loading') {
    return <div>Loading</div>
  }

  if (status === 'failed') {
    return <div>Error</div>
  }

  if (fonts.length === 0) {
    return <div>No fonts</div>
  }

  return (
    <Autocomplete
      disableClearable
      autoSelect
      openOnFocus
      size="small"
      noOptionsText="No result"
      options={fonts}
      value={value}
      getOptionLabel={option => option}
      renderOption={option => {
        const fontId = getFontId(option)

        return (
          <span
            id={`font-button-${fontId}${fontManager.current!.selectorSuffix}`}
          >
            {option}
          </span>
        )
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off'
          }}
        />
      )}
      onChange={(e: any, fontName: string) => handleChange(fontName)}
      onInputChange={(e: any, query: string) => handleSearch(query)}
    />
  )
}
