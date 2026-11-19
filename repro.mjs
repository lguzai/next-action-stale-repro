// Loads the page, waits until its prerendered entry is stale, then calls the server action once.
// Needs `npm run build && npm start` running, and `npx playwright install chromium`.
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
const statuses = []
page.on('response', (response) => {
  if (response.request().method() === 'POST') statuses.push(response.status())
})
await page.goto('http://localhost:3000/')
await page.waitForTimeout(6_000)
await page.getByRole('button', { name: 'Save' }).click()
await page.locator('#result').filter({ hasText: /\S/ }).waitFor()
console.log({ actionStatus: statuses[0], result: await page.locator('#result').textContent() })
await browser.close()
