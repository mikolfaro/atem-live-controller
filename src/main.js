import RoutedApp from './RoutedApp.svelte';
import './styles/main.scss'

let app = new RoutedApp({
	target: document.body,
	hydrate: true
});

export default app;
