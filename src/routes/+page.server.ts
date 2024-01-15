import type { Actions } from "./$types";
import { srpSearch, getPageCount } from "$lib/server/srpSearch";
import { parseLeaderboardResponse, parseTimingResponse } from "$lib/server/srpParser";

export const actions: Actions = {
  search: async ({ request }) => {
    return [
      {
        rank: 4,
        date: '2023/12/30 23:00',
        name: 'Jonathan',
        car: 'Mazda ɛ̃fini RX-7 FD3S [SPEED FACTORY RGO]',
        time: '02:02.273',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:05.047                                        ',
        s2: '00:57.226                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 7,
        date: '2023/12/30 19:17',
        name: 'Jonathan',
        car: 'Honda S2000 Turbo GT1 Amuse (AP1)',
        time: '02:03.125',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:04.704                                        ',
        s2: '00:58.421                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 9,
        date: '2023/12/30 20:40',
        name: 'Jonathan',
        car: 'Nissan Skyline GT-R V-Spec (BCNR33) Wangan Specification',
        time: '02:03.986',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:06.672                                        ',
        s2: '00:57.314                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 18,
        date: '2023/12/30 19:32',
        name: 'Jonathan',
        car: 'Nissan Skyline GT-R R34 Nismo Omori Factory S1',
        time: '02:07.269',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:08.083                                        ',
        s2: '00:59.186                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 20,
        date: '2023/12/30 21:41',
        name: 'Jonathan',
        car: 'Toyota Supra MKIV Ridox Body Kit',
        time: '02:07.538',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:08.785                                        ',
        s2: '00:58.753                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 21,
        date: '2023/12/30 18:44',
        name: 'Jonathan',
        car: 'Toyota MR2 Shutoko•Spec',
        time: '02:07.632',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:08.021                                        ',
        s2: '00:59.611                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 23,
        date: '2023/12/30 19:41',
        name: 'Jonathan',
        car: 'RE Amemiya Furinkazan μ FC',
        time: '02:08.260',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:07.465                                        ',
        s2: '01:00.795                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 24,
        date: '2023/12/30 18:27',
        name: 'Jonathan',
        car: 'Lamborghini Murciélago LP 640 (Veilside)',
        time: '02:08.409',
        input: 'Wheel',
        tyre: 'HR',
        s1: '01:08.638                                        ',
        s2: '00:59.771                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 33,
        date: '2023/12/30 18:08',
        name: 'Jonathan',
        car: 'Mitsubishi Lancer Evolution V Wangan Spec',
        time: '02:10.036',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:08.883                                        ',
        s2: '01:01.153                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 37,
        date: '2023/12/30 22:03',
        name: 'Jonathan',
        car: 'Nissan Silvia S15 [SPEED FACTORY RGO]',
        time: '02:11.140',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:09.750                                        ',
        s2: '01:01.390                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 47,
        date: '2023/12/30 21:09',
        name: 'Jonathan',
        car: 'Ferrari F40 Custom',
        time: '02:12.482',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:10.941                                        ',
        s2: '01:01.541                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 55,
        date: '2023/12/30 23:57',
        name: 'Jonathan',
        car: 'Porsche 911 Turbo (930) Blackbird',
        time: '02:14.171',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:10.899                                        ',
        s2: '01:03.272                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 57,
        date: '2023/12/30 23:31',
        name: 'Jonathan',
        car: 'Nissan Skyline HR31 House-Spec',
        time: '02:14.209',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:09.743                                        ',
        s2: '01:04.466                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 70,
        date: '2023/12/30 20:49',
        name: 'Jonathan',
        car: 'Mitsubishi Lancer Evolution IX MR VARIS',
        time: '02:17.188',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:14.979                                        ',
        s2: '01:02.209                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 78,
        date: '2023/12/30 21:18',
        name: 'Jonathan',
        car: 'Honda Civic Type R (EK9) Turbo ver. 2',
        time: '02:20.260',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:14.066                                        ',
        s2: '01:06.194                                        ',
        s3: undefined,
        s4: undefined
      },
      {
        rank: 82,
        date: '2023/12/30 20:56',
        name: 'Jonathan',
        car: 'Honda Integra Type R (DC2) Turbo',
        time: '02:22.286',
        input: 'Wheel',
        tyre: 'ST',
        s1: '01:14.473                                        ',
        s2: '01:07.813                                        ',
        s3: undefined,
        s4: undefined
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
    console.log(results)
    return results
  }
}