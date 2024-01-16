<script lang='ts'>
  export let rowData: any;
  export let sourcePage: string;
  export let fastest: string;

  import CopyIcon from 'virtual:icons/mdi/content-copy';
  import OpenNewIcon from 'virtual:icons/mdi/open-in-new';

  async function copyClipboard(text: string, node: HTMLElement) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.log(e)
    }
  }
</script>

<div id='modal'>
  <h1>Details</h1>
  <table>
    <thead>
      <tr>
        <th>LAP DETAILS</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each Object.entries(rowData) as [key, value]}
      <tr>
        <td class='key'>{key.toUpperCase()}</td>
        <td class='value'>{value}</td>
      </tr>
      {/each}
      <tr>
        <td class='key'>FASTEST</td>
        <td class='value'>{(fastest) ? 'Yes' : 'No'}</td>
      </tr>
    </tbody>
  </table>
  
  <h2>Metadata</h2>
  <div class='metadata-sec'>
    <div class='metadata-head'>
      <h3>Page Link</h3>
      <a href={sourcePage} target="_blank" rel="norefferer">
        <div class='text-icon-wrap'>
          <p>Navigate</p>
          <OpenNewIcon />
        </div>
      </a>
    </div>
    <p>{sourcePage}<button><CopyIcon /></button></p>
  </div>
  <div class='metadata-sec'>
    <div class='metadata-head'>
      <h3>Run Link</h3>
      <a href={sourcePage} target="_blank" rel="norefferer">
        <div class='text-icon-wrap'>
          <p>Navigate</p>
          <OpenNewIcon />
        </div>
      </a>
    </div>
    <p>{sourcePage}<button><CopyIcon /></button></p>
  </div>
</div>


<style>
  /* General Modal Details */
  #modal {
    background-color: var(--secondary);
    color: var(--font-color);
    overflow-x: hidden;
  }
  h1 {
    font-size: 1.5rem;
  }
  h2 {
    font-size: 1.3rem;
    margin: 2rem 0 1rem;
  }

  /* Table */
  table {
    margin: 1rem auto;
    border: 1px solid var(--border);
  }
  table tbody tr:hover {
    cursor: inherit;
    background-color: inherit;
  }

  /* Metadata */
  .metadata-sec {
    margin: 1.5rem 0;
  }
  .metadata-head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 0.85rem;
  }
  .metadata-head a {
    color: var(--highlight);
    text-decoration: none;
  }
  .text-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .text-icon-wrap:hover {
    text-decoration: underline;
  }
  .text-icon-wrap > p {
    margin: 0 0.3rem;
  }
  .metadata-sec > p {
    background-color: var(--primary);
    padding: 0.7rem;
    margin: 0.7rem 0;
    font-size: 0.8rem;
    overflow-x: scroll !important;
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding-right: 3.2rem;
  }
  .metadata-sec > p button {
    display: flex;
    align-items: center;
    position: absolute;
    right: 1.5rem;
    padding: 0.4rem;
    border: 1px solid var(--highlight);
    border-radius: 5px;
    font-size: 0.8rem;
    background-color: var(--secondary);
    color: var(--highlight);
    transition: 0.2s;
  }
  .metadata-sec > p button:hover {
    cursor: pointer;
    background-color: var(--primary);
  }
</style>