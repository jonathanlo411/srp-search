<script lang='ts'>
    export let name: string;
    export let idName: string = '';
    export let className: string = '';
    export let options: Record<string, string>;
    export let value: string = '';

    let first = true;
    const setFalse = () => {first = false}
</script>

<select name={name} bind:value={value} id={idName} class={className}> 
    {#each Object.entries(options) as [name, optValue]}
        <!-- {#if first}
            <option value={optValue} selected>{name}</option>
            {setFalse()}
        {:else} -->
            <option value={optValue}>{name}</option>
        <!-- {/if} -->
    {/each }
</select>