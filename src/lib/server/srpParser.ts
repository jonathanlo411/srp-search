
const TABLE_CONFIG = {
  'timing': {
    start: 2
  },
  'timing/points': {
    start: 1,
  },
  'overtake': {
    start: 2,
  }
}

export function parseLeaderboardResponse(
  query: 'timing/points' | 'overtake',
  srpPageData: string,
  name: string,
  url: string
): PointsResponse | OvertakeResponse | undefined {
  // Loop using specific skips and starts to only search through names
  const tableRegex: RegExp = /<td\b[^>]*>([\s\S]*?)<\/td>/g;
  let tableItems: Array<string> = [];
  let match;
  while (match = tableRegex.exec(srpPageData)) { tableItems.push(match[1]) }
  const tableSkips = srpPageData.match(/<th\b[^>]*>(.*?)<\/th>/g)!.length
  for (let i = TABLE_CONFIG[query].start; i < tableItems.length; i += tableSkips) {
    if (tableItems[i].includes(name)) {

      // Stopping early on points and overtake leaderboards because name only shows up once
      if (query === 'timing/points') {
        return {
          rank: +tableItems[i - 1], 
          points: +tableItems[i + 1],
          name: tableItems[i],
          sourcePage: url
        }
      } else {
        return {
          rank: +tableItems[i - 2],
          date: tableItems[i - 1],
          name: tableItems[i],
          car: tableItems[i + 1],
          duration: tableItems[i + 2],
          spm: tableItems[i + 3],
          score: tableItems[i + 4],
          sourcePage: url
        }
      }
    }
  }
}

export function parseTimingResponse(
  srpPageData: string,
  name: string,
  url: string
): Array<TimingResponse> {
  // Skip value can depend on track due to differing # of sectors
  const tableRegex: RegExp = /<td\b[^>]*>([\s\S]*?)<\/td>/g;
  const tableRegexHeaders: RegExp = /<th\b[^>]*>([\s\S]*?)<\/th>/g;
  let tableItems: Array<string> = [];
  let tableHeaders: Array<string> = [];
  let match;
  while (match = tableRegex.exec(srpPageData)) { tableItems.push(match[1]) }
  while (match = tableRegexHeaders.exec(srpPageData)) { tableHeaders.push(match[1]) }
  const tableSkips = tableHeaders.length

  let timingList: Array<TimingResponse> = []
  let s3Available: boolean = false;
  let s4Available: boolean = false;
  tableHeaders.forEach((d) => {
    if (d.includes('S3')) { s3Available = true; }
    if (d.includes('S4')) { s4Available = true; }
  })

  console.log(tableItems)
  for (let i = TABLE_CONFIG['timing'].start; i < tableItems.length; i += tableSkips) {
    // console.log(tableItems[i])
    if (tableItems[i].includes(name)) {
      let regex = /(\/timing\/lap\?id=\d+)/;
      const match = (tableItems[i]!.parentNode as Element).getAttribute('onclick')?.match(regex)

      // Init timing resposne
      let raceItem: TimingResponse = {
        rank: +tableItems[i - 2],
        date: tableItems[i - 1],
        name: tableItems[i],
        car: tableItems[i + 1],
        time: tableItems[i + tableSkips - 3],
        fastest: (tableItems[i]!.parentNode as Element)?.className === 'text-purple',
        sourcePage: url,
        runLink: match ? `https://hub.shutokorevivalproject.com${match[1]}` : 'NOT FOUND',
        input: undefined,
        tyre: undefined,
        s1: undefined,
        s2: undefined,
        s3: undefined,
        s4: undefined
      }

      // Add other details if existing
      if (tableItems[i + 3]) {
        raceItem.tyre = tableItems[i + 3]
        raceItem.s1 = tableItems[i + 4].slice(1)
        raceItem.s2 = tableItems[i + 5].slice(1)
      }
      if (s3Available) { raceItem.s3 = tableItems[i + 6].slice(1)}
      if (s4Available) { raceItem.s4 = tableItems[i + 7].slice(1)}
      if (tableItems[i + 2]) { raceItem.input = tableItems[i + 2]}

      // Save
      timingList.push(raceItem)
    }
  }
  return timingList
}
