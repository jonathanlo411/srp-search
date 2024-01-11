import { JSDOM } from 'jsdom'

export async function srpSearch(
  query: 'timing' | 'timing/points' | 'overtake',
  leaderboard: string,
  stage: string,
  car: string,
  page: number,
  month: boolean
): Promise<Document> {
  // Fetch query
  const url = `https://hub.shutokorevivalproject.com/${query}?`
  const rawRes = await fetch(url + new URLSearchParams({
    leaderboard: leaderboard,
    track: 'shuto_revival_project_beta',
    stage: stage,
    car: car,
    page: page.toString(),
    month: (+month).toString()
  }))
  const res = await rawRes.text()

  // Returnning DOM Parser
  const dom = new JSDOM(res)
  return dom.window.document
}

export async function getPageCount(
  query: 'timing' | 'timing/points' | 'overtake',
  leaderboard: string,
  stage: string,
  car: string,
  month: boolean
): Promise<PageCount | undefined> {
  // Fetch query
  const url = `https://hub.shutokorevivalproject.com/${query}?`
  const rawRes = await fetch(url + new URLSearchParams({
    leaderboard: leaderboard,
    track: 'shuto_revival_project_beta',
    stage: stage,
    car: car,
    month: (+month).toString()
  }))
  const res = await rawRes.text()

  // Seraching for total entries
  const dom = new JSDOM(res)
  const doc = dom.window.document
  const entriesText = doc.querySelector('div.card-footer p.text-muted')
  if (entriesText && entriesText.textContent) {
    const totalCountMatch = entriesText.textContent.match(/Showing \d+ - \d+ of (\d+) entries/);
    const totalCount = parseInt(totalCountMatch![1], 10);
    return {
      entries: totalCount,
      pages: Math.ceil(totalCount/25)
    }
  }
}