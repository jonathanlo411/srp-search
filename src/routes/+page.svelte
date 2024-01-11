<script lang='ts'>
  let progress = 0;

  const updateProgress = (value: number) => {
    progress = value;
  };
</script>

<div>
  <h1>Search</h1>
  <form action="?/search" method='POST'>
    <button>Search</button>
  </form>
</div>