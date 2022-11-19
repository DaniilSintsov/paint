import React from 'react'

export interface IBarInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue: number
  description: string
  min: number
  max: number
}
