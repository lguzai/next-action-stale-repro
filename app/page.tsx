import { cacheLife } from 'next/cache'

import { SaveButton } from './SaveButton'

async function renderedAt() {
  'use cache'
  cacheLife('short')
  return new Date().toISOString()
}

export default async function Page() {
  return (
    <main>
      <p>Rendered at {await renderedAt()}</p>
      <SaveButton />
    </main>
  )
}
