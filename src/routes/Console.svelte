<script>
    import Feather from "../components/Feather.svelte";

    export let switchers
    export let ws

    const pageName = "Console"
</script>

{#each switchers as atem}
    <header>
        <h1>{pageName} - {atem.state._pin}</h1>
        <a href="#switcher" class="tab"><Feather icon="grid"/>Switcher</a>
        <a href="#media" class="tab"><Feather icon="film"/>Media</a>
        <a href="#macros" class="tab"><Feather icon="box"/>Macros</a>
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
                    <div
                            class="button"
                            class:red={atem.isProgramChannel(channel)}
                            class:green={atem.isPreviewChannel(channel)}
                            on:click={e => atem.changePreview(channel)}>
                        <p>{channel.label}</p>
                    </div>
                {/each}
            </div>
        </section>

        <section class="transition">
            <h3>Transition</h3>
            <div class="well">
                <div class="button" on:click={e=>atem.cutTransition()}>
                    <p>CUT</p>
                </div>
                <div
                        class="button"
                        class:red={atem.state.video.ME[0].transitionPosition > 0}
                        on:click={e=>atem.autoTransition()}>
                    <p>AUTO</p>
                </div>
                <input class="slider" type="range"
                       min="0" max="1" step="0.001"
                       bind:value={atem.state.video.ME[0].transitionPosition}
                       on:input={e => atem.changeTransitionPosition(atem.state.video.ME[0].transitionPosition)}
                />
            </div>
        </section>

        <section class="next-transition">
            <h3>Next Transition</h3>
            <div class="well">
                <div
                        class="button"
                        class:yellow={atem.state.video.ME[0].upstreamKeyNextBackgroundState}
                        on:click={e => atem.toggleUpstreamKeyNextBackground()}>
                    <p>BKGD</p>
                </div>
                <div
                        class="button"
                        class:red={atem.state.video.ME[0].upstreamKeyState[0]}
                        on:click={e => atem.toggleUpstreamKeyState(0)}>
                    <p>ON<br />AIR</p>
                </div>
                <div
                        class="button"
                        class:yellow={atem.state.video.ME[0].upstreamKeyNextState[0]}
                        on:click={e => atem.toggleUpstreamKeyNextState(0)}>
                    <p>Key 1</p>
                </div>
            </div>
        </section>

        <section class="transition-style">
            <h3>Transition style</h3>
            <div class="well">
                <div
                        class="button"
                        class:yellow={atem.state.video.ME[0].transitionStyle == 0}
                        on:click={e => atem.changeTransitionType(0)}>
                    <p>MIX</p>
                </div>
                <div
                        class="button"
                        class:yellow={atem.state.video.ME[0].transitionStyle == 1}
                        on:click={e => atem.changeTransitionType(1)}>
                    <p>DIP</p>
                </div>
                <div
                        class="button"
                        class:yellow={atem.state.video.ME[0].transitionStyle == 2}
                        on:click={e => atem.changeTransitionType(2)}>
                    <p>WIPE</p>
                </div>
                {#if atem.state.topology.numberOfStingers > 0}
                    <div
                            class="button"
                            class:yellow={atem.state.video.ME[0].transitionStyle == 3}
                            on:click={e => atem.changeTransitionType(3)}>
                        <p>STING</p>
                    </div>
                {/if}
                {#if atem.state.topology.numberOfDVEs > 0}
                    <div
                            class="button"
                            class:yellow={atem.state.video.ME[0].transitionStyle == 4}
                            on:click={e => atem.changeTransitionType(4)}>
                        <p>DVE</p>
                    </div>
                {/if}
                <div class="button" on:click={atem.changeTransitionPreview}>
                    <p>PREV<br />TRAN</p>
                </div>
            </div>
        </section>

        <section class="downstream-key">
            <h3>Downstream Key 1</h3>
            <div class="well">
                <div
                        class="button"
                        class:yellow={atem.state.video.downstreamKeyTie[0]}
                        on:click={e => atem.toggleDownstreamKeyTie(0)}>
                    <p>TIE</p>
                </div>
                <div
                        class="button"
                        class:red={atem.state.video.downstreamKeyOn[0]}
                        on:click={e => atem.toggleDownstreamKeyOn(0)}>
                    <p>ON<br />AIR</p>
                </div>
                <div
                        class="button"
                        class:red={false}
                        on:click={e => atem.autoDownstreamKey(0)}>
                    <p>AUTO</p>
                </div>
            </div>
        </section>
        <section class="downstream-key">
            <h3>Downstream Key 2</h3>
            <div class="well">
                <div
                        class="button"
                        class:yellow={atem.state.video.downstreamKeyTie[1]}
                        on:click={e => atem.toggleDownstreamKeyTie(1)}>
                    <p>TIE</p>
                </div>
                <div
                        class="button"
                        class:red={atem.state.video.downstreamKeyOn[1]}
                        on:click={e => atem.toggleDownstreamKeyOn(1)}>
                    <p>ON<br />AIR</p>
                </div>
                <div
                        class="button"
                        class:red={false}
                        on:click={e => atem.autoDownstreamKey(1)}>
                    <p>AUTO</p>
                </div>
            </div>
        </section>

        <section class="fade-to-black">
            <h3>Fade to Black</h3>
            <div class="well">
                <div
                        class="button"
                        class:red={atem.state.video.ME[0].fadeToBlack}
                        on:click={e=>atem.fadeToBlack()}>
                    <p>FTB</p>
                </div>
            </div>
        </section>
    </div><!-- screen switcher-->

    <div id="media" class="screen">
        <h2>Media</h2>
        <div class="media-thumb well"
             on:drop={e=>atem.uploadMediaFile(e.dataTransfer.files[0], 1)}>
            <img alt="Upload Media 1"
                 on:click={e=>e.target.parentNode.querySelector('input').click()}
            />
            <input type="file" name="media" on:change={e=>atem.uploadMediaFile(e.target.files[0], 0)}/>
        </div>
        <div class="media-thumb well"
             on:drop={e=>atem.uploadMediaFile(e.dataTransfer.files[0], 2)}>
            <img alt="Upload Media 2"
                 on:click={e=>e.target.parentNode.querySelector('input').click()}
            />
            <input type="file" name="media" on:change={e=>atem.uploadMediaFile(e.target.files[0], 1)}/>
        </div>
    </div><!-- screen media-->

    <div id="macros" class="screen">
        <h2>Macros</h2>
        <div class="well">
            {#if atem.state.macros}
                {#each Object.entries(atem.state.macros) as macro }
                    <div class="button button-wide"
                         class:red={false}
                         on:click={e=>atem.runMacro(macro[0])}
                         title={macro[1].description}>
                        <p>{macro[1].name}</p>
                    </div>
                {/each}
            {/if}
        </div>
    </div> <!-- screen macros -->
{/each}
