import React from 'react'
import cx from 'classnames'
import './style.scss'

const Title = ({children, level, color , className, style}) => {
  return (
    <h1
      style={{
        color,
        ...style
      }} 
    className={
      cx(`mb-0 font-family-FoundersGrotesk ${className}`,
        {
          'level-large-tile': level == 'largeTile',
          'level-1': level == 1,
          'level-2': level == 2,
          'level-3': level == 3,
          'head-line': level == 'headLine',
          'sub-heading': level == 'subHeading',
        }
      )
    }
    >
      {children}
    </h1>
  )
}

const Text = ({children, className, color, style}) => {
  return (
    <p style={{...style,color}} className={`body-text font-family-FoundersGrotesk ${className}`}>
      {children}
    </p>
  )
}

const CallOut = ({children}) => {
  return (
    <p className='call-out font-family-FoundersGrotesk'>
      {children}
    </p>
  )
}

const Footnote = ({children, color, className}) => {
  return (
    <p style={{color}} className={`foot-note font-family-FoundersGrotesk ${className}`}>
      {children}
    </p>
  )
}

const Caption = ({children, className, color}) => {
  return (
    <p style={{color}} className={`caption font-family-FoundersGrotesk ${className}`}>
      {children}
    </p>
  )
}

export {
    Title,
    Text,
    CallOut,
    Footnote,
    Caption
}