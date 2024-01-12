<script lang='ts'>
    export let name: string;
    export let idName: string = '';
    export let className: string = '';
    export let options: Record<string, string>;
    export let value: string = '';

    value = Object.entries(options)[0][1]
</script>

<select name={name} bind:value={value} id={idName} class={className}> 
    {#each Object.entries(options) as [name, optValue], i}
        <option value={optValue}>{name}</option>
    {/each }
</select>