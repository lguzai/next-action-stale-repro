'use server'

export async function save(value: string): Promise<string> {
  console.log(`action ran with ${JSON.stringify(value)}`)
  return `saved ${value}`
}
