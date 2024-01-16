import type { Actions } from "./$types";
import { srpSearch, getPageCount } from "$lib/server/srpSearch";
import { parseLeaderboardResponse, parseTimingResponse } from "$lib/server/srpParser";

export const actions: Actions = {
  search: async ({ request }) => {
    return [
      {
        rank: 6,
        date: '2023/11/22 23:40',
        name: 'Jonathan',
        car: 'Mazda ɛ̃fini RX-7 FD3S [SPEED FACTORY RGO]',
        time: '04:32.987',
        fastest: false,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=0',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:36.580                                        ',
        s2: '01:06.530                                        ',
        s3: '01:11.665                                        ',
        s4: '00:38.212                                        '
      },
      {
        rank: 8,
        date: '2023/12/31 17:07',
        name: 'Jonathan',
        car: 'Toyota Supra MKIV Ridox Body Kit',
        time: '04:45.757',
        fastest: true,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=0',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:42.344                                        ',
        s2: '01:10.268                                        ',
        s3: '01:12.870                                        ',
        s4: '00:40.275                                        '
      },
      {
        rank: 13,
        date: '2023/12/31 16:53',
        name: 'Jonathan',
        car: 'Honda S2000 Turbo GT1 Amuse (AP1)',
        time: '04:50.319',
        fastest: false,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=0',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:45.747                                        ',
        s2: '01:11.955                                        ',
        s3: '01:11.572                                        ',
        s4: '00:41.045                                        '
      },
      {
        rank: 15,
        date: '2023/12/31 17:18',
        name: 'Jonathan',
        car: 'Nissan Skyline GT-R V-Spec (BCNR33) Wangan Specification',
        time: '04:53.052',
        fastest: false,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=0',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:46.182                                        ',
        s2: '01:11.472                                        ',
        s3: '01:14.788                                        ',
        s4: '00:40.610                                        '
      },
      {
        rank: 16,
        date: '2023/12/31 17:30',
        name: 'Jonathan',
        car: 'Lamborghini Murciélago LP 640 (Veilside)',
        time: '04:57.898',
        fastest: true,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=0',
        input: 'Wheel',
        tyre: 'HR',
        s1: '01:47.404                                        ',
        s2: '01:13.606                                        ',
        s3: '01:14.838                                        ',
        s4: '00:42.050                                        '
      },
      {
        rank: 30,
        date: '2023/12/31 17:48',
        name: 'Jonathan',
        car: 'RE Amemiya Furinkazan μ FC',
        time: '05:18.926',
        fastest: false,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=1',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:58.137                                        ',
        s2: '01:19.295                                        ',
        s3: '01:16.277                                        ',
        s4: '00:45.217                                        '
      },
      {
        rank: 32,
        date: '2023/12/31 17:57',
        name: 'Jonathan',
        car: 'Mitsubishi Lancer Evolution V Wangan Spec',
        time: '05:20.174',
        fastest: false,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=1',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:57.267                                        ',
        s2: '01:19.823                                        ',
        s3: '01:17.815                                        ',
        s4: '00:45.269                                        '
      },
      {
        rank: 43,
        date: '2023/11/25 22:37',
        name: 'Jonathan',
        car: 'Honda Integra Type R (DC2) Turbo',
        time: '05:38.604',
        fastest: true,
        sourcePage: 'https://hub.shutokorevivalproject.com/timing?leaderboard=Default&track=shuto_revival_project_beta&stage=Bayshore+Northbound&car=&month=0&page=1',
        input: 'Wheel',
        tyre: 'ST',
        s1: '02:03.555                                        ',
        s2: '01:23.812                                        ',
        s3: '01:22.372                                        ',
        s4: '00:48.865                                        '
      }
    ]
    
    
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
        let res = parseTimingResponse(
          srpPageData.pageData as Document,
          name, srpPageData.url as string
        )
        results = results.concat(res)
      } else {
        let res = parseLeaderboardResponse(
          mode,
          srpPageData.pageData as Document,
          name, srpPageData.url as string
        )
        if (res) {
          results.push(res)
          break
        }
      }
    }
    
    // Send results
    return results
  }
}