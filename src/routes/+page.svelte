<script lang='ts'>
  import { deserialize } from '$app/forms';
  import SimpleSelect from '$lib/client/SimpleSelect.svelte'
  import selectOptions from '$lib/selectFields.json'
  import messages from '$lib/loadingMessages.json'
  import Toggle from "svelte-toggle";
  import { onMount } from 'svelte';
  import { setNotification } from '$lib/client/notification';

  let mode: string;
  let leaderboard: string;
  let results: Array<Record<string, number | string>>;
  let headers: Array<string>;
    
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
      const rawRes = await fetch(formElement.action, {
        method: 'POST',
        body: formData
      })
      results = (deserialize(await rawRes.text()) as any)['data']

      // Validating Response
      if (results.length === 0) {
        setNotification('No entries found!', false)
      } else {
        headers = Object.keys(results[0])
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
  <h1>Shutoku Revival Project Leaderboard Search</h1>
  <form action="?/search" method='POST' on:submit|preventDefault={handleSubmit}>
    
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
          <SimpleSelect className='s-select' name='car' options={selectOptions['srpCars'][(leaderboard === 'TrafficSlow') ? 'slow' : 'fast']} />
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
    color: var(--font);
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
    color: var(--font);
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
</style>