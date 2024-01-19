<script lang='ts'>
  import questions from "$lib/faq.json"
  // Types bug in unplugin icons
  // @ts-ignore
  import BackIcon from 'virtual:icons/mdi/arrow-left';
  import FaqExpand from "$lib/client/faqExpand.svelte";
</script>

<svelte:head>
  <title>SRP Leaderboard Search - About</title>
</svelte:head>

<div id='about'>
  <a id='back' href='/'><BackIcon /></a>
  <h1>About</h1>
  
  <div class='about-head'>
    <h2>Project Details</h2>
    <p>This is a small webapp used to search the Official Shutoko Revival Project leaderboards hosted at <a href='https://hub.shutokorevivalproject.com/timing' target='_blank' rel='norefferer'>https://hub.shutokorevivalproject.com/timing</a>. Currently, there is not a method to search by name which this project fulfills. I do not take any credit for any of the development features behind AssettoServer and its sub-projects.
    <br><br>
    This project is open source. Source code is hosted on GitHub and can be found <a href='https://github.com/jonathanlo411/srp-search' target="_blank" rel='norefferer'>here</a>. In addition, SRP Leaderboard Search is licensed under the GNU General Public License v3. Details can be found <a href='https://github.com/jonathanlo411/srp-search/blob/main/LICENSE' target="_blank" rel='norefferer'>here</a>.
    </p>
  </div>

  
  <div class='about-head'>
    <h2>FAQ</h2>
    {#each Object.entries(questions) as [question, response]}
      <FaqExpand question={question} response={response} />
    {/each}
  </div>
    
</div>

<style>
  #about {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 5px;
    width: min(95%, 1500px);
    margin: 3rem auto;
    padding: 1rem;
    position: relative;
  }
  #about h1 {
    font-weight: bold;
    font-size: 2.2rem;
    margin-top: 1.2rem;
    display: flex;
  }
  #back {
    border: 1px solid var(--highlight);
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 2.1rem;
    width: 2.1rem;
    transition: 0.25s;
  }
  #back:hover {
    cursor: pointer;
    background-color: var(--highlight);
    border: 1px solid var(--primary);
    color: var(--primary);
  }
  :global(a, a:visited) {
    color: var(--highlight);
  }

  /* Questions */
  .about-head {
    margin-top: 2rem;
  }
  .about-head h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
</style>