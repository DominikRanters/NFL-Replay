<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppBar, AppShell, Drawer, Modal, Toast, drawerStore } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';

	import { headerText } from '$lib/stores';

	function drawerOpen(): void {
		drawerStore.open();
	}

	let header = '';
	headerText.subscribe((preVal) => (header = preVal));
</script>

<Toast position="tr" />
<Modal />
<Drawer>
	<Navigation />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
	<svelte:fragment slot="header">
		<AppBar>
			<!-- <svelte:fragment slot="lead"> -->
			<!-- <button class="md:hidden btn btn-sm mr-4" on:click={drawerOpen}>
					<span>
						<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
							<rect width="100" height="20" />
							<rect y="30" width="100" height="20" />
							<rect y="60" width="100" height="20" />
						</svg>
					</span>
				</button> -->

			<svelte:fragment slot="lead"
				><a href="/overview">
					<i class="fa-solid fa-arrow-left text-2xl" />
				</a></svelte:fragment
			>
			<div class="pl-6">
				<h1 class="h1 uppercase">{header}</h1>
			</div>
			<!-- </svelte:fragment> -->
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<!-- Router Slot -->
	<div>
		<slot />
	</div>
	<!-- ---- / ---- -->
</AppShell>
