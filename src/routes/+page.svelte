<script lang='ts'>
  import { deserialize } from '$app/forms';
  import SimpleSelect from '$lib/client/SimpleSelect.svelte'
  import selectOptions from '$lib/selectFields.json'
  import Toggle from "svelte-toggle";
  import { onMount } from 'svelte';

  let mode: string;
  let leaderboard: string;
  let results: Array<Record<string, number | string>>;
  let headers: Array<string>;
    
  let toggled = false;
  let loading = false;
  let error = '';

  let loadText: HTMLButtonElement;
  let submitBt: HTMLButtonElement;
  let loadSec: HTMLDivElement;
  const messages = [
    'Checking tire pressure...',
    'Refueling pit stop...',
    'Navigating the track...',
    'Accelerating down the straightaway...',
    'Tackling hairpin turns...',
    'Shifting gears...',
    'Hitting top speed...',
    'Dodging obstacles...',
    'Overtaking competitors...',
    'Mastering the race line...',
    'Executing a perfect drift...',
    'Crossing the finish line...',
    'Celebrating victory...',
    'Setting a new lap record...',
    'Spinning donuts in celebration...',
    'Unleashing turbo boost...',
    'Precision steering...',
    'Adrenaline pumping...',
    'Racing against the clock...',
    'Engine roaring...',
    'Gaining pole position...',
    'Perfecting the racing line...',
  ];

  function changeLoadingText() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    loadText.textContent = messages[randomIndex];
  }

  function toggleLoading() {
    let loadingTimeout;
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

    // Submitting Form
    try {
      const formElement = e.target as HTMLFormElement
      const formData = new FormData(formElement)
      const rawRes = await fetch(formElement.action, {
        method: 'POST',
        body: formData
      })
      results = (deserialize(await rawRes.text()) as any)['data']
      headers = Object.keys(results[0])
      error = ''
    } catch {
      error = 'Something went wrong!'
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
  <h1>Shutoku Revival Project Leaderboard Search</h1>
  <form action="?/search" method='POST' on:submit|preventDefault={handleSubmit}>
    <span class='input-title'>Name</span>
    <input name='name' value='Jonathan' type='text' required>
    <span class='input-title'>Mode</span>
    <select class='s-select' name='mode' bind:value={mode} required>
      <option value='timing'>Timing</option>
      <option value='timing/points'>Points</option>
      <option value='overtake'>Overtake</option>
    </select>

    <!-- Different options dont exist on the mode -->
    {#if mode === 'timing'}
      <span class='input-title'>Leaderboard</span>
      <SimpleSelect className='s-select' name='leaderboard' options={selectOptions['timingLeaderboardOpts']} bind:value={leaderboard} />
      <span class='input-title'>Route</span>
      <SimpleSelect className='s-select' name='stage' options={selectOptions['srpRoutes']} />
      <span class='input-title'>Car</span>
      <SimpleSelect className='s-select' name='car' options={selectOptions['srpCars'][(leaderboard === 'TrafficSlow') ? 'slow' : 'fast']} />
      <span class='input-title'>Current Month</span>
      <input name='month' type='hidden' bind:value={toggled}>
      <Toggle
        label=''
        switchColor="#eee"
        toggledColor="rgb(163, 90, 132)"
        untoggledColor="rgb(42, 39, 41)"
        bind:toggled
      />
    {:else if mode ==='timing/points'}
      <span class='input-title'>Leaderboard</span>
      <SimpleSelect className='s-select' name='leaderboard' options={selectOptions['pointsLeaderBoardOpts']} />
      <span class='input-title'>Current Month</span>
      <input name='month' type='hidden' bind:value={toggled}>
      <Toggle
        label=''
        switchColor="#eee"
        toggledColor="rgb(163, 90, 132)"
        untoggledColor="rgb(42, 39, 41)"
        bind:toggled
      />
    {:else}
      <span class='input-title'>Leaderboard</span>
      <SimpleSelect className='s-select' name='leaderboard' options={selectOptions['overtakeLeaderBoardOpts']} />
    {/if}
    <button id='search-bt' type='submit'>Search</button>
  </form>
</div>

{#if results}
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
      {#each results as tableEntry}
        <tr>
          {#each Object.values(tableEntry) as value}
            <td>{(value) ? value : '\n'}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
{/if}

<div id='loading'>
  <div class="loader"></div>
  <p>Revving up engines...</p>
</div>

{#if error}
<div id='error'>
  <p>{error}</p>
</div>
{/if}

<style>

  /* Search */
  #search {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    width: 95%;
    margin: 3rem auto;
    padding: 1rem;
  }
  #search h1 {
    font-weight: bold;
    font-size: 2.2rem;
    margin-top: 1.2rem;
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
    border-radius: 3px;
    border: 1px solid var(--border);
    background-color: var(--primary);
    color: var(--font);
  }
  form input:hover, :global(.s-select):hover { cursor: pointer; }

  #search-bt {
    background-color: var(--highlight);
    color: var(--font);
    outline: none;
    border: none;
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
  #loading p { font-size: 1.2rem; }

  /* Results */
  #results {
    width: 95%;
    margin: 2rem auto;
    border: 1px solid var(--border);
    border-radius: 5px;
    background-color: var(--secondary);
    overflow-x: auto;
  }
  table {
    border-collapse: collapse;
    font-size: 1rem;
    width: 100%;
  }
  table thead tr {
    background-color: var(--primary);
    color: rgb(101, 93, 98);
    font-weight: bold;
    font-size: 0.7rem;
    text-align: left;
  }
  table th,
  table td {
    padding: 0.4rem;
  }
  table tbody tr {
    border-bottom: 1px solid var(--border);
  }

  /* Error */
  #error {
    background-color: red;
    padding: 0.5rem;
    font-size: 1.2rem;
    width: fit-content;
    margin: auto;
    border-radius: 5px;
  }
</style>