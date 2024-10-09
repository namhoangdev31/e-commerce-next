'use client'

import React from 'react'

import { useTheme } from '../index'
import { Theme, themeLocalStorageKey } from './types'

import { Chevron } from '../../../../components/Chevron'
import classes from './index.module.scss'

export const ThemeSelector: React.FC = () => {
  const selectRef = React.useRef<HTMLSelectElement>(null)
  const { setTheme } = useTheme()
  const [show, setShow] = React.useState(false)

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      if (selectRef.current) selectRef.current.value = 'auto'
    } else {
      setTheme(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (selectRef.current) {
      selectRef.current.value = preference ?? 'auto'
      setShow(true)
    }
  }, [])

  return (
    <div className={`relative visible opacity-100 transition-opacity duration-50 ${!show ? 'opacity-0 hidden' : ''}`}>
      <label htmlFor="theme">
        <select
          id="theme"
          onChange={e => onThemeChange(e.target.value as Theme & 'auto')}
          ref={selectRef}
          className="pr-14"
        >
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <div className="absolute right-0 top-0 h-full pointer-events-none w-6">
          <Chevron className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <Chevron className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2" />
        </div>
      </label>
    </div>
  )
}
