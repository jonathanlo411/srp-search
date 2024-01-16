<script lang='ts'>
  export let question: string;
  export let response: string;

  // Types bug in unplugin icons
  // @ts-ignore
  import ExpandIcon from 'virtual:icons/mdi/chevron-right';

  let expanded: boolean = false;
  $: rotation = expanded ? 90 : 0;
  function toggleExpand() { expanded = !expanded; }
</script>

<button
  class='question'
  on:click={toggleExpand}
>
  <span>{question}</span>
  <div id='rotate' style="transform: rotate({rotation}deg);"><ExpandIcon /></div>
</button>
{#if expanded}
<div class='response'>
  <p>{@html response}</p>
</div>
{/if}

<style>
  .question {
    width: 100%;
    font-size: 1.2rem;
    text-align: left;
    padding: 0.5rem;
    margin: 0.2rem 0;
    background-color: var(--secondary);
    border: 1px solid var(--subdued);
    border-radius: 5px;
    color: var(--font-color);
    transition: 0.25s;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .question:hover {
    cursor: pointer;
    border: 1px solid var(--highlight);
    color: var(--highlight)
  }
  #rotate {
    transition: 0.2s;
    display: flex;
    align-items: center;
  }

  .response {
    padding: 1rem 0.5rem;
  }
</style>

