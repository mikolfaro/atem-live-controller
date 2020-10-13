<script>
    import Feather from "../components/Feather.svelte";

    export let switchers
    export let ws
    export let intercom

    const pageName = "Camera"

    function toggleAlert(label) {
        intercom.toggleAlert(label)
        intercom = intercom
    }
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

    <div id="switcher" class="screen">
        <section class="channels">
            <h3>Program & Preview</h3>
            <div class="well">
                {#each atem.visibleChannels as channel}
                    {#if channel.label.startsWith("CAM") }
                        <div id="{channel.label}"
                             class="button"
                             class:red={atem.isProgramChannel(channel)}
                             class:green={atem.isPreviewChannel(channel)}
                             class:alert={intercom.cams[channel.label] && intercom.cams[channel.label].alert}
                             on:click={e => toggleAlert(channel.label)}>

                            <p>{channel.label}</p>
                        </div>
                    {/if}
                {/each}
            </div>
        </section>
    </div>
{/each}
