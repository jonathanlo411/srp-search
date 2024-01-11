<script lang='ts'>
	import { enhance } from '$app/forms';
  import SimpleSelect from '$lib/client/SimpleSelect.svelte'
  import selectOptions from '$lib/selectFields.json'
  import Toggle from "svelte-toggle";


  let mode: string;
  let leaderboard: string;
  let toggled = false;
</script>

<div id='search'>
  <h1>Shutoku Revival Project Leaderboard Search</h1>
  <form action="?/search" method='POST' use:enhance>
    <span class='input-title'>Name</span>
    <input name='name' placeholder='Ex. Jonathan' type='text'>
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
      <input name='month' type='checkbox' bind:value={toggled} hidden>
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
      <input name='month' type='checkbox' bind:value={toggled} hidden>
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

<style>
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

</style>