<script lang='ts'>
  import { getContext } from 'svelte';
  import Popup from './popup.svelte';

  // Weired bug where types aren't being detected
  // @ts-ignore
  const { open } = getContext('simple-modal');

  function showModal(
      data: TimingResponse | PointsResponse | OvertakeResponse,
  ) {
      open(Popup, { 
        rowData: data,
        fastest: fastest,
        sourcePage: sourcePage,
        runLink: runLink
      });
  }

  export let rowData: TimingResponse | PointsResponse | OvertakeResponse;
  export let sourcePage: string;
  export let fastest: boolean = false;
  export let runLink: string = '';
</script>

<tr on:click={() => showModal(rowData)} class:fastest={fastest}>
  {#each Object.values(rowData) as value}
      <td>{(value) ? value : '\n'}</td>
  {/each}
</tr>

<style>
  .fastest {
      color: var(--fastest)
  }
</style>