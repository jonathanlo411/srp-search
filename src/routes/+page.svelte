<script lang='ts'>
  import { deserialize } from '$app/forms';
  import SimpleSelect from '$lib/client/SimpleSelect.svelte'
  import selectOptions from '$lib/selectFields.json'
  import messages from '$lib/loadingMessages.json'
  import Toggle from "svelte-toggle";
  import { onMount } from 'svelte';
  import { setNotification } from '$lib/client/notification';
  import TableRow from './tableRow.svelte';

  // Weired bug where types aren't being detected
  // @ts-ignore
  import Modal from 'svelte-simple-modal'

  let mode: modeSelect;
  let leaderboard: string;
  let results: Array<
    TimingResponse |
    PointsResponse |
    OvertakeResponse
  > = [];
  let fastest: Array<boolean> = [];
  let sources: Array<string> = [];
  let runLinks: Array<string> = [];
  let headers: Array<string>;
  let submittedMode: modeSelect;
    
  let toggled = false;
  let loading = false;
  
  let loadText: HTMLButtonElement;
  let submitBt: HTMLButtonElement;
  let loadSec: HTMLDivElement;
  let loadingTimeout: NodeJS.Timeout;
  let lastRandomIndex: number | null;

  function changeLoadingText() {
    let randomIndex = Math.floor(Math.random() * messages.length);
    if (randomIndex === lastRandomIndex) {
      randomIndex ++
      lastRandomIndex = randomIndex
    }
    loadText.textContent = messages[randomIndex];
  }

  function toggleLoading() {
    if (loading) {
      submitBt.classList.remove('blocked') // Remove blocked button
      submitBt.disabled = false; // Re-enable button
      loadSec.style.display = 'none' // Remove loading in results
      clearInterval(loadingTimeout) // Stop the text changing
      loading = false;
    } else {
      if (results) {
        results = []
      }
      submitBt.classList.add('blocked') // Block off button to prevent multiple submissions
      submitBt.disabled = true; // Disable button
      loadSec.style.display = 'flex' // Display results loading
      loadingTimeout = setInterval(changeLoadingText, 1500) // Begin text changing
      loading = true;
    }
  }

  async function handleSubmit(e: Event) {
    // Enable loading state
    toggleLoading()
    
    try {
      // Validating Form
      const formElement = e.target as HTMLFormElement
      const formData = new FormData(formElement)
      submittedMode = formData.get('mode') as modeSelect
      if (!formData.get('name')) {
        setNotification("Please fill out 'Name'!", true)
        toggleLoading()
        return
      }
      if (formData.get('mode') === null) {
        setNotification("Please select an entry for 'Mode'!", true)
        toggleLoading()
        return
      }
      if (formData.get('mode') === 'timing' && formData.get('car') === null) {
        setNotification("Please select an entry for 'Car'!", true)
        toggleLoading()
        return
      }

      // Submitting Form
      // @ts-ignore
      const endpoint = '/api/search?' + new URLSearchParams(formData)
      const response = await fetch(endpoint, {
        method: 'GET'
      })
      const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader();

      // Clear old state
      fastest = []
      sources = []
      runLinks = []
      results = []
      headers = []

      // Reading and Validating Response
      while (true) {

        // Await Reader
        const { value, done } = await reader.read();
        if (done) break;
        let newData: Array<TimingResponse | PointsResponse | OvertakeResponse> = JSON.parse(value)

        if (submittedMode === 'timing') {
          // TS can't detect double casting
          // @ts-ignore
          fastest = fastest.concat(newData.map(d => d.fastest))
          // @ts-ignore
          runLinks = runLinks.concat(newData.map(d => d.runLink))
        }
        sources = sources.concat(newData.map(d => d.sourcePage))

        // Removing properties to clean up the UI
        // @ts-ignore
        newData = newData.map(d => {
          // TS can't detect double casting
          // @ts-ignore
          const { fastest, sourcePage, runLink, ...rest } = d
          return rest
        })

        if (newData && newData.length !== 0) {
          const newHeaders =  Object.keys(newData[0])
          headers = (!headers || newHeaders.length > headers.length) ? newHeaders : headers
        }
        results = results.concat(newData)
      }  

      if (results.length === 0) {
        setNotification('No entries found!', false)
      }

    } catch (e) {
      setNotification('Something went wrong!', true)
    }

    // Remove loading state
    toggleLoading()
  }

  onMount(() => {
    loadText = document.querySelector('#loading p')!
    submitBt = document.querySelector('#search-bt')!
    loadSec = document.querySelector('#loading')!
  })

</script>

<svelte:head>
  <title>SRP Leaderboard Search</title>
</svelte:head>

<div id='search'>
  <h1 class='primary'>Shutoko Revival Project Leaderboard Search</h1>
  <h1 class='secondary'>SRP Leaderboard Search</h1>
  <p>This is a small webapp used to search the Official Shutoko Revival Project leaderboards. Currently, there is not a method to search by name which this project fulfills. For more information click <a href='/about'>here</a>.</p>
  <form action="/api/search" method='GET' on:submit|preventDefault={handleSubmit}>
    
    <div class='side-input-group'>
      <div class='input-group'>
        <span class='input-title'>Name</span>
        <input name='name' placeholder='Ex. Jonathan' type='text'>
      </div>
      <div class='input-group'>
        <span class='input-title'>Mode</span>
        <select class='s-select' name='mode' bind:value={mode} required>
          <option value='timing'>Timing</option>
          <option value='timing/points'>Points</option>
          <option value='overtake'>Overtake</option>
        </select>
      </div>
    </div>

    <!-- Different options dont exist on the mode -->
    {#if mode === 'timing'}
      <div class='side-input-group'>
        <div class='input-group'>
          <span class='input-title'>Leaderboard</span>
          <SimpleSelect className='s-select' name='leaderboard' options={selectOptions['timingLeaderboardOpts']} bind:value={leaderboard} />
        </div>
        <div class='input-group'>
          <span class='input-title'>Route</span>
          <SimpleSelect className='s-select' name='stage' options={selectOptions['srpRoutes']} />
        </div>
      </div>
      <div class='side-input-group'>
        <div class='input-group'>
          <span class='input-title'>Car</span>
          <SimpleSelect className='s-select' name='car' options={selectOptions['srpCars'][
            (leaderboard === 'TrafficSlow') ? 'slow' : 
            (leaderboard === "Clawie's Selection Carpack") ? 'clawies' : 'fast'
          ]} />
        </div>
        <div class='input-group'>
          <span class='input-title'>Current Month</span>
          <input name='month' type='hidden' bind:value={toggled}>
          <Toggle
            hideLabel
            switchColor="#eee"
            toggledColor="rgb(163, 90, 132)"
            untoggledColor="rgb(42, 39, 41)"
            bind:toggled
          />
        </div>
      </div>
    {:else if mode ==='timing/points'}
      <div class='side-input-group'>
        <div class='input-group'>
          <span class='input-title'>Leaderboard</span>
          <SimpleSelect className='s-select' name='leaderboard' options={selectOptions['pointsLeaderBoardOpts']} />
        </div>
        <div class='input-group'>
          <span class='input-title'>Current Month</span>
          <input name='month' type='hidden' bind:value={toggled}>
          <Toggle
            label=''
            switchColor="#eee"
            toggledColor="rgb(163, 90, 132)"
            untoggledColor="rgb(42, 39, 41)"
            bind:toggled
          />
        </div>
      </div>
    {:else}
      <div class='input-group'>
        <span class='input-title'>Leaderboard</span>
        <SimpleSelect className='s-select' name='leaderboard' options={selectOptions['overtakeLeaderBoardOpts']} />
      </div>
    {/if}
    <button id='search-bt' type='submit'>Search</button>
  </form>
</div>

{#if results && results.length !== 0}
<div id='results'>
  <table>
    <thead>
      <tr>
        {#each headers as header}
          <th>{header.toUpperCase()}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each results as tableEntry, i}
        <Modal
          classContent='modal-content'
        >
        {#if submittedMode === 'timing'}
          <TableRow
            rowData={tableEntry}
            fastest={fastest[i]}
            runLink={runLinks[i]}
            sourcePage={sources[i]}
          />
          {:else}
          <TableRow
            rowData={tableEntry}
            sourcePage={sources[i]}
          />
          {/if}
        </Modal>
      {/each}
    </tbody>
  </table>
</div>
{/if}

<div id='loading'>
  <div class="loader"></div>
  <p>Revving up engines...</p>
</div>

<div id='notification'></div>

<style>

  /* Search */
  #search {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    width: min(95%, 1500px);
    margin: 3rem auto;
    padding: 1rem;
  }
  #search h1 {
    font-weight: bold;
    font-size: 2.2rem;
    margin-top: 1.2rem;
  }
  .secondary {
    display: none;
  }
  #search > p {
    margin: 1rem 0;
    font-size: 1rem;
  }
  a, a:visited {
    color: var(--highlight);
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 0.5rem;
    padding: 0.5rem 0;
  }
  form .input-title {
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0.7rem 0;
  }
  form input, :global(.s-select) {
    font-size: 1.05rem;
    padding: 0.5rem;
    outline: none;
    border: none;
    border-radius: 5px;
    border: 1px solid var(--border);
    background-color: var(--primary);
    color: var(--font-color);
    transition: 0.3s;
  }
  :global(.s-select):hover { cursor: pointer; }
  form input:focus, :global(.s-select):focus {
    border: 1px solid white;
    box-shadow: 0 0 10px 0 var(--highlight);
  }
  .input-group {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  #search-bt {
    background-color: var(--highlight);
    color: var(--font-color);
    outline: none;
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 1.5% 0;
  }
  #search-bt:hover { cursor: pointer; }
  :global(.blocked) { opacity: 0.5; }
  :global(.blocked:hover) { cursor: not-allowed !important; }

  /* Loading */
  #loading {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
  .loader {
    border: 0.25rem solid var(--secondary); 
    border-top: 0.25rem solid var(--highlight); 
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    animation: spin 1.5s ease-in-out infinite;
    margin: 1.6vh auto;
    outline: white;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  #loading p {
    font-size: 1.2rem;
    padding-bottom: 5rem;
  }

  /* Results */
  #results {
    width: min(95%, 1500px);
    margin: 2rem auto;
    border: 1px solid var(--border);
    border-radius: 5px;
    background-color: var(--secondary);
    overflow-x: auto;
  }
  :global(table) {
    border-collapse: collapse;
    font-size: 1rem;
    width: 100%;
  }
  :global(table thead tr) {
    background-color: var(--primary);
    color: rgb(101, 93, 98);
    font-weight: bold;
    font-size: 0.7rem;
    text-align: left;
  }
  :global(table th),
  :global(table td) {
    padding: 0.4rem;
  }
  :global(table tbody tr) {
    border-bottom: 1px solid var(--border);
  }
  :global(table tbody tr:hover) {
    cursor: pointer;
    background-color: var(--primary);
  }

  /* Modal */
  :global(.modal-content) {
    background-color: var(--secondary);
    border-radius: 5px;
    border: var(--border);
    overflow-x: hidden !important;
  }

  /* Media Queries */
  @media screen and (min-width: 1080px) {

    .side-input-group {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    }

    .input-group {
      width: 49%;
      margin: 0.5rem auto;
    }
  }
  @media screen and (max-width: 1080px) {
    /* Size Rendering */
    .primary {
      display: none;
    }
    .secondary {
      display: block;
    }
  }

</style>