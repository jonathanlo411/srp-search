
export async function srpSearch(
  query: 'timing' | 'timing/points' | 'overtake',
  leaderboard: string,
  stage: string,
  car: string,
  page: number,
  month: boolean
): Promise<Record<string, string>> {
  // Fetch query
  const url = `https://hub.shutokorevivalproject.com/${query}?`
  const combinedURL = url + new URLSearchParams({
    leaderboard: leaderboard,
    track: 'shuto_revival_project_beta',
    stage: stage,
    car: car,
    month: (+month).toString(),
    page: page.toString()
  })
  const rawRes = await fetch(combinedURL)
  const res = await rawRes.text()

  // Returnning DOM Parser
  return {
    pageData: res,
    url: combinedURL
  }
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
  const combinedURL = url + new URLSearchParams({
    leaderboard: leaderboard,
    track: 'shuto_revival_project_beta',
    stage: stage,
    car: car,
    month: (+month).toString()
  })
  const rawRes = await fetch(combinedURL)
  const res = await rawRes.text()

  // Seraching for total entries
  const totalCountMatch = res.match(/Showing \d+ - \d+ of (\d+) entries/);
  const totalCount = parseInt(totalCountMatch![1], 10);
  return {
    entries: totalCount,
    pages: Math.ceil(totalCount/25)
  }
}