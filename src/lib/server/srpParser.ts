
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
  srpPageData: Document,
  name: string
): PointsResponse | OvertakeResponse | undefined {
  // Loop using specific skips and starts to only search through names
  const tableItems = srpPageData.querySelectorAll('td')
  const tableSkips = srpPageData.querySelectorAll('th').length
  for (let i = TABLE_CONFIG[query].start; i < tableItems.length; i += tableSkips) {
    if (tableItems[i].textContent?.includes(name)) {
      // Stopping early on points and overtake leaderboards because name only shows up once
      if (query === 'timing/points') {
        return {
          rank: +tableItems[i - 1].textContent!, 
          name: tableItems[i].textContent!,
          points: +tableItems[i + 1].textContent!
        }
      } else {
        return {
          rank: +tableItems[i - 2].textContent!,
          date: tableItems[i - 1].textContent!,
          name: tableItems[i].textContent!,
          car: tableItems[i + 1].textContent!,
          duration: tableItems[i + 2].textContent!,
          spm: tableItems[i + 3].textContent!,
          score: tableItems[i + 4].textContent!
        }
      }
    }
  }
}

export function parseTimingResponse(
  srpPageData: Document,
  name: string
): Array<TimingResponse> {
  // Skip value can depend on track due to differing # of sectors
  let timingList: Array<TimingResponse> = []
  const tableItems: NodeList = srpPageData.querySelectorAll('td')
  const tableHeaders: NodeList = srpPageData.querySelectorAll('th')
  const tableSkips: number = tableHeaders.length
  let s3Available: boolean = false;
  let s4Available: boolean = false;
  tableHeaders.forEach((d) => {
    if (d.textContent?.includes('S3')) { s3Available = true; }
    if (d.textContent?.includes('S4')) { s4Available = true; }
  })

  for (let i = TABLE_CONFIG['timing'].start; i < tableItems.length; i += tableSkips) {
    if (tableItems[i].textContent?.includes(name)) {

      // Init timing resposne
      let raceItem: TimingResponse = {
        rank: +tableItems[i - 2].textContent!,
        date: tableItems[i - 1].textContent!,
        name: tableItems[i].textContent!,
        car: tableItems[i + 1].textContent!,
        time: tableItems[i + tableSkips - 3].textContent!,
        input: undefined,
        tyre: undefined,
        s1: undefined,
        s2: undefined,
        s3: undefined,
        s4: undefined
      }

      // Add other details if existing
      if (tableItems[i + 3].textContent) {
        raceItem.tyre = tableItems[i + 3].textContent!
        raceItem.s1 = tableItems[i + 4].textContent!.slice(1)
        raceItem.s2 = tableItems[i + 5].textContent!.slice(1)
      }
      if (s3Available) { raceItem.s3 = tableItems[i + 6].textContent!.slice(1)}
      if (s4Available) { raceItem.s4 = tableItems[i + 7].textContent!.slice(1)}
      if (tableItems[i + 2].textContent) { raceItem.input = tableItems[i + 2].textContent!}

      // Save
      timingList.push(raceItem)
    }
  }
  return timingList
}
