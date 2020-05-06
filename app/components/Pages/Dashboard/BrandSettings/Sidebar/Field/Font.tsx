import React, { useState, useEffect, useRef } from 'react'
import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
  FontManager,
  FONT_FAMILY_DEFAULT,
  OPTIONS_DEFAULTS,
  Font
} from '@samuelmeuli/font-manager'

import config from 'config'

import { FieldProps } from './types'

function getFontId(fontFamily: string): string {
  return fontFamily.replace(/\s+/g, '-').toLowerCase()
}

export default function FontField({
  value = FONT_FAMILY_DEFAULT,
  names,
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
        fontManager.current = new FontManager(
          config.google.api_key,
          FONT_FAMILY_DEFAULT,
          {
            ...OPTIONS_DEFAULTS,
            filter: fontManagerFilter,
            limit: 500
          }
        )

        const fontList = await fontManager.current.init()
        const fontNames = Array.from(fontList.values()).map(item => item.family)

        setFonts(fontNames)
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

    fontManager.current.setOnChange((font: Font) => {
      onChange(names, font.family)
    })
  }, [names, onChange])

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

  return (
    <Autocomplete
      disableClearable
      openOnFocus
      loading={status === 'loading'}
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
