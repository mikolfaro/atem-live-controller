<script>
    import Feather from "../components/Feather.svelte";

    export let switchers
    export let ws

    const pageName = "Camera"
</script>

{#each switchers as atem}
    <header>
        <h1>{pageName} - {atem.state._pin}</h1>
        <a href="/console" class="tab"><Feather icon="grid"/>Console</a>
        <a href="/camera" class="tab"><Feather icon="camera" />Camera</a>

        <span class="tab connection-status" class:connected={ws.readyState === 1}
              title="Connection status: green=connected, red=disconnected">
            {#if ws.readyState === 1}<Feather icon="zap"/>{:else}<Feather icon="alert-triangle"/>{/if}
            Server
        </span>
        <span class="tab connection-status" class:connected={atem.connected}
              title="Connection status: green=connected, red=disconnected">
            {#if atem.connected}<Feather icon="zap"/>{:else}<Feather icon="alert-triangle"/>{/if}
            ATEM
        </span>
    </header>
{/each}
