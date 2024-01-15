<script lang='ts'>
    import { getContext } from 'svelte';
    import Popup from './popup.svelte';
    const { open } = getContext('simple-modal');
    function showModal(
        data: TimingResponse | PointsResponse | OvertakeResponse,
        mode: 'timing' | 'timing/points' | 'overtake'
    ) {
        open(Popup, { rowData: data, mode: mode });
    }

    export let rowData: TimingResponse | PointsResponse | OvertakeResponse;
    export let mode: 'timing' | 'timing/points' | 'overtake';
</script>

<tr on:click={showModal(rowData, mode)}>
    {#each Object.values(rowData) as value}
        <td>{(value) ? value : '\n'}</td>
    {/each}
</tr>
