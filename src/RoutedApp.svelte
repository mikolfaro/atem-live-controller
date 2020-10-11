<script>
    import { Router, Link, Route } from "svelte-routing"
    import Camera from "./routes/Camera.svelte"
    import Console from "./routes/Console.svelte"

    export let url = ""
</script>

<Router url="{ url }">
    <nav>
        <Link to="console">Console</Link>
        <Link to="camera">Camera</Link>
    </nav>
    <div>
        <Route path="console" component="{Console}" />
        <Route path="camera" component="{Camera}" />
    </div>
</Router>
