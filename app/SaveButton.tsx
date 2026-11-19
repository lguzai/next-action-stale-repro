'use client'

import { useState } from 'react'

import { save } from './actions'

export function SaveButton() {
  const [result, setResult] = useState('')
  return (
    <>
      <button
        onClick={() =>
          save('hello').then(
            (answer) => setResult(answer),
            (error: unknown) => setResult(`failed: ${String(error)}`),
          )
        }
      >
        Save
      </button>
      <p id="result">{result}</p>
    </>
  )
}
