import { srpSearch, getPageCount } from '$lib/server/srpSearch.js';
import { parseTimingResponse, parseLeaderboardResponse } from '$lib/server/srpParser.js';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {

  // Initialize default search
  let name: string = '';
  let mode: modeSelect = 'timing';
  let leaderboard: string = 'Default';
  let stage: string = '';
  let car: string = '';
  let month: boolean = false;

  // Parse URL params
  name = url.searchParams.get('name') ?? name
  mode = url.searchParams.get('mode') as modeSelect ?? mode
  leaderboard = url.searchParams.get('leaderboard') ?? leaderboard
  if (mode === 'timing') {
    stage = url.searchParams.get('stage') ?? 'Bayshore Northbound'
    car = url.searchParams.get('car') ?? car
    month = url.searchParams.get('month') === 'false' ? false : true
  } else if (mode === 'timing/points') {
    month = url.searchParams.get('month') === 'false' ? false : true
    leaderboard = url.searchParams.get('leaderboard') ?? ''
  }

  // Initialize Search
  const pageCount = await getPageCount(mode, leaderboard, stage, car, month)
  if (!pageCount) {
    return json({
      status: 500,
      message: 'No pages detected.'
    })
  }

  // Initialize stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {

      // Begin Querying
      for (let i = 0; i < pageCount.pages; i ++) {
        const srpPageData = await srpSearch(mode, leaderboard, stage, car, i, month)
        if (mode === 'timing') {
          let res = parseTimingResponse(
            srpPageData.pageData as string,
            name,
            srpPageData.url as string
          )
          controller.enqueue(encoder.encode(JSON.stringify(res)))
        } else {
          let res = parseLeaderboardResponse(
            mode,
            srpPageData.pageData as string,
            name,
            srpPageData.url as string
          )
          if (res) {
            controller.enqueue(encoder.encode(JSON.stringify([res])))
            break
          }
        }
      }
      controller.close()
    }
  })

  // Returning the stream
  return new Response(readable, {
    headers: {
      'content-type': 'json/event-stream',
    }
  });

}

