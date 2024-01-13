import type { Actions } from "./$types";
import { srpSearch, getPageCount } from "$lib/server/srpSearch";
import { parseLeaderboardResponse, parseTimingResponse } from "$lib/server/srpParser";

export const actions: Actions = {
  search: async ({ request }) => {
    
    // Parse Client Form
    const formData = await request.formData()
    const name = String(formData.get('name'))
    const mode = String(formData.get('mode')) as 'timing' | 'timing/points' | 'overtake'
    const leaderboard = String(formData.get('leaderboard'))
    let stage = '';
    let car = '';
    let month = false;
    if (mode === 'timing') {
      stage = String(formData.get('stage'))
      car = String(formData.get('car'))
      month = formData.get('month') === 'false' ? false : true
    } else if (mode === 'timing/points') {
      month = formData.get('month') === 'false' ? false : true
    }

    // Begin Serach
    let results: any = []
    const pageCount = await getPageCount(mode, leaderboard, stage, car, month)
    if (!pageCount) return
    for (let i = 0; i < pageCount.pages; i ++) {
      const srpPageData = await srpSearch(mode, leaderboard, stage, car, i, month)
      if (mode === 'timing') {
        let res = parseTimingResponse(srpPageData, name)
        results = results.concat(res)
      } else {
        let res = parseLeaderboardResponse(mode, srpPageData, name)
        if (res) {
          results.push(res)
        }
        break
      }
    }
    
    // Send results
    return results
  }
}