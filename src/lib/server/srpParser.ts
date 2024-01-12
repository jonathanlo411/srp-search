
const TABLE_CONFIG = {
  'timing': {
    start: 2,
    skip: {
      'Bayshore Northbound': 11,
      'Bayshore Southbound': 10,
      'Belt Inner': 10,
      'Belt Outer': 10,
      'C1 Inner': 10,
      'C1 Outer': 10,
      'Mirai Outer': 10,
      'Shibuya': 9,
      'Shinjuku': 9,
      'Yokohane Northbound': 10,
      'Yokohane Southbound': 10
    }
  },
  'timing/points': {
    start: 1,
    skip: 3,
  },
  'overtake': {
    start: 2,
    skip: 7,
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
  stage: string,
  srpPageData: Document,
  name: string
): Array<TimingResponse> {
  // Skip value can depend on track due to differing # of sectors
  let timingList: Array<TimingResponse> = []
  const tableItems = srpPageData.querySelectorAll('td')
  const stageSkip: number = (TABLE_CONFIG['timing'].skip as any)[stage];
  const tableSkips = srpPageData.querySelectorAll('th').length

  for (let i = TABLE_CONFIG['timing'].start; i < tableItems.length; i += tableSkips) {
    if (tableItems[i].textContent?.includes(name)) {
      console.log('here')

      // Init timing resposne
      let raceItem: TimingResponse = {
        rank: +tableItems[i - 2].textContent!,
        date: tableItems[i - 1].textContent!,
        name: tableItems[i].textContent!,
        car: tableItems[i + 1].textContent!,
        time: tableItems[i + stageSkip - 3].textContent!,
        input: undefined,
        tyre: undefined,
        s1: undefined,
        s2: undefined,
        s3: undefined,
        s4: undefined
      }

      console.log(raceItem)

      // Add other details if existing
      if (tableItems[i + 3].textContent) {
        raceItem.tyre = tableItems[i + 3].textContent!
        raceItem.s1 = tableItems[i + 4].textContent!.slice(1)
        raceItem.s2 = tableItems[i + 5].textContent!.slice(1)
      }
      if (!(stage==='Shibuya' || stage==='Shinjuku')) { raceItem.s3 = tableItems[i + 6].textContent!.slice(1)}
      if (stage === 'Bayshore Northbound') { raceItem.s4 = tableItems[i + 7].textContent!.slice(1)}
      if (tableItems[i + 2].textContent) { raceItem.input = tableItems[i + 2].textContent!}

      // Save
      timingList.push(raceItem)
    }
  }
  return timingList
}


function obtainSkips(srpPageData: Document) {
  console.log(srpPageData.querySelectorAll('th').length)
}