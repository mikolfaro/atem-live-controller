import RoutedApp from './RoutedApp.svelte';

let app = new RoutedApp({
	target: document.body,
	hydrate: true
});

export default app;
