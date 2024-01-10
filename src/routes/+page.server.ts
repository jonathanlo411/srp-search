import type { Actions } from "./$types";
import { srpSearch, getPageCount } from "$lib/server/srpSearch";

export const actions: Actions = {
  search: async ({ request }) => {
    // TODO: Parse Client Form

    // Begin Serach
    let pageCount = await getPageCount('timing/points', 'Default', '', '', false)
    console.log(pageCount)
    return
    let data: Document = await srpSearch('timing/points', 'Default', '', '', 0, false)
    data.getElementsByClassName('tr')
    
    
  }
}