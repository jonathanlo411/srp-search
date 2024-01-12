<div id="base">
    <slot></slot>
</div>

<style>
    /* General Styling */
    @import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');
    :global(*) {
        box-sizing: border-box;
        margin: 0;
    }
    :global(body) {
        /* General Styling */
        font-family: 'Montserrat';
        color: var(--font-color);
		background-color: var(--primary);

        /* Color vars */
        --primary: #2a2729;
        --secondary: #302c2e;
        --border: rgb(55,52,59);
        --highlight: rgb(163, 90, 132);
        --fastest: rgb(174, 62, 201);
        --font-color: white;
    }
</style>