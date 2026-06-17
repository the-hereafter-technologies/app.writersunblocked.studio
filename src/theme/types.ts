import type { RuleSet } from 'styled-components'
import type * as colors from './colors'

export type Color = string
export type ColorScheme = {
  [key: string]: Color
}

export type Colors = {
  // biome-ignore lint/suspicious/noExplicitAny: uses any
  [key: string]: Color | ColorScheme | any
}

export type PaletteShades = {
  ['0']?: Color
  ['100']?: Color
  ['200']?: Color
  ['300']?: Color
  ['400']?: Color
  ['500']?: Color
  ['600']?: Color
  ['700']?: Color
  ['800']?: Color
  ['900']?: Color
}

export type Palette = {
  background: Color
  text: Color
  accent: Color
  brand: typeof colors
  shades?: PaletteShades
}

export type Typography = {
  color?: Color
  textDecoration?:
    | 'none'
    | 'underline'
    | 'overline'
    | 'line-through'
    | 'blink'
    | 'inherit'
    | 'initial'
    | 'unset'
    | 'revert'
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: number
  fontStyle?: string
}

export type Breakpoints = {
  sm: number
  lg: number
  [key: string]: number
}

export interface SiteTheme {
  id?: string
  palette: Palette
  gutters?: {
    [key in keyof Breakpoints]: number
  }
  typography: {
    body: Typography
    [key: string]: Typography
  }
  breakpoints: Breakpoints
  media?: {
    [key in keyof Breakpoints]: string | number
  }
  variables?: Record<string, string>
}
