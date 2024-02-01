
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
  const tableRegex: RegExp = /<tr\b[^>]*>([\s\S]*?)<\/tr>/g;
  const tableRegexHeaders: RegExp = /<th\b[^>]*>([\s\S]*?)<\/th>/g;
  let tableItems = srpPageData.match(tableRegex)!;
  let tableHeaders: Array<string> = [];
  let match;
  while (match = tableRegexHeaders.exec(srpPageData)) { tableHeaders.push(match[1]) }
  const tableSkips = tableHeaders.length

  let timingList: Array<TimingResponse> = []
  let s3Available: boolean = false;
  let s4Available: boolean = false;
  tableHeaders.forEach((d) => {
    if (d.includes('S3')) { s3Available = true; }
    if (d.includes('S4')) { s4Available = true; }
  })

  // Going row by row
  const lapIDRegEx: RegExp = /lap\?id=(\d+)/;
  const fastestRegEx: RegExp = /class="([^"]*\btext-purple\b[^"]*)"/;
  const itemsRegEx: RegExp = /<td\b[^>]*>([\s\S]*?)<\/td>/g;
  for (let i = 1; i < tableItems.length; i ++) {
    const rowData = tableItems[i]

    let rowItems = [];
    while (match = itemsRegEx.exec(rowData)) { rowItems.push(match[1]) }
    const namePos = TABLE_CONFIG['timing'].start
    if (rowItems[namePos].includes(name)) {

      // Regex matching the tr item for lap details
      const lapID = rowData.match(lapIDRegEx)
      const fastest = fastestRegEx.test(rowData)

      // Init timing resposne
      let raceItem: TimingResponse = {
        rank: +rowItems[0],
        date: rowItems[1],
        name: rowItems[2],
        car: rowItems[3],
        time: rowItems[tableSkips - 1],
        fastest: fastest,
        sourcePage: url,
        runLink: lapID ? `https://hub.shutokorevivalproject.com/timing/lap?id=${lapID[1]}` : 'NOT FOUND',
        input: undefined,
        tyre: undefined,
        s1: undefined,
        s2: undefined,
        s3: undefined,
        s4: undefined
      }

      // Add other details if existing
      if (rowItems[5]) {
        raceItem.tyre = rowItems[5]
        raceItem.s1 = rowItems[6].slice(1)
        raceItem.s2 = rowItems[7].slice(1)
      }
      if (s3Available) { raceItem.s3 = rowItems[8].slice(1)}
      if (s4Available) { raceItem.s4 = rowItems[9].slice(1)}
      if (rowItems[4]) { raceItem.input = rowItems[4]}

      // Save
      timingList.push(raceItem)

    }
  
  }
  return timingList
}
