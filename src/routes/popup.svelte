<script lang='ts'>
    export let rowData: any;
    export let sourcePage: string;
    export let fastest: string;
</script>


{#each Object.entries(rowData) as [k, value]}
    <p>{k}: {(value) ? value : '\n'}</p>
{/each}