import type { Actions } from "./$types";
import { srpSearch, getPageCount } from "$lib/server/srpSearch";
import { parseLeaderboardResponse, parseTimingResponse } from "$lib/server/srpParser";

export const actions: Actions = {
  search: async ({ request }) => {
    // TODO: Parse Client Form
    const query = 'overtake'
    const leaderboard = 'Default'
    const name = 'Jonathan'
    const stage = 'Bayshore Northbound'

    // Begin Serach
    let results: any = []
    const pageCount = await getPageCount(query, leaderboard, stage, '', false)
    if (!pageCount) return
    for (let i = 0; i < pageCount.pages; i ++) {
      const srpPageData = await srpSearch(query, leaderboard, stage, '', i, false)
      if (query === 'timing') {
        let res = parseTimingResponse(stage, srpPageData, name)
        results = results.concat(res)
      } else {
        let res = parseLeaderboardResponse(query, srpPageData, name)
        results = res
        break
      }
    }
    
    // Send results
    console.log(results)
  }
}