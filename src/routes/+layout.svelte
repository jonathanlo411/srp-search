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

    /* Site wide scrollbars */
    :global(::-webkit-scrollbar) {
        height: 0.3rem;
        width: 0.3rem;
    }
    :global(::-webkit-scrollbar-track) {
        background: none;
    }

    /* Handle */
    :global(::-webkit-scrollbar-thumb) {
        border-radius: 100px;
        background-color: #ccc;
        transition: 0.2s;
    }

    /* Handle on hover */
    :global(::-webkit-scrollbar-thumb:hover) {
        background: #b4b4b4;
    }
</style>