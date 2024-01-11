<script lang='ts'>
  import { deserialize } from '$app/forms';
  import SimpleSelect from '$lib/client/SimpleSelect.svelte'
  import selectOptions from '$lib/selectFields.json'
  import Toggle from "svelte-toggle";

  let mode: string;
  let leaderboard: string;
  let toggled = false;
  let results: Array<Record<string, number | string>>;
  let headers: Array<string>;

  async function handleSubmit(e: Event) {
    // Submitting Form
    const formElement = e.target as HTMLFormElement
    const formData = new FormData(formElement)
    const rawRes = await fetch(formElement.action, {
      method: 'POST',
      body: formData
    })
    results = (deserialize(await rawRes.text()) as any)['data']
    headers = Object.keys(results[0])
  }
</script>

<div id='search'>
  <h1>Shutoku Revival Project Leaderboard Search</h1>
  <form action="?/search" method='POST' on:submit|preventDefault={handleSubmit}>
    <span class='input-title'>Name</span>
    <input name='name' value='Jonathan' type='text'>
    <span class='input-title'>Mode</span>
    <select class='s-select' name='mode' bind:value={mode}>
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
</style>