<svelte:head>
	<meta name="description" content="About this app" />
	<link href='https://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
</svelte:head>
<div class="app">


	<main>
		<slot />
	</main>

</div>

<script>
  import "../app.css";
</script>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
