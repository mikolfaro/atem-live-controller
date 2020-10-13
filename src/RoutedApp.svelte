<script>
    import { onMount } from "svelte";
    import { Router, Route } from "svelte-routing";

    import Camera from "./routes/Camera.svelte"
    import Console from "./routes/Console.svelte"
    import {ATEM} from "./atem";

    export let url = ""
    let switchers = [];
    let ws = { readyState: 0};
    let intervalID = 0;

    function doConnect() {
        console.debug("Opening websocket...");
        let url  = window.location + "";
        url = url.slice(0, url.lastIndexOf("/"));
        url = url.replace("http", "ws");
        ws = new WebSocket(url + "/ws");
        ws.addEventListener("open", function(event) {
            console.log("Websocket opened");
            intervalID = clearTimeout(intervalID);
            switchers[0] = new ATEM();
            switchers[0].setWebsocket(ws);
            // update svelte
            ws = ws;
        });
        ws.addEventListener("message", function(event) {
            let data = JSON.parse(event.data);
            let device = data.device || 0;
            console.log(data);
            switch (data.method) {
                case 'connect':
                    switchers[device].connected = true;
                    break;
                case 'disconnect':
                    switchers[device].connected = false;
                    break;
                default:
                    switchers[device].connected = true;
                    switchers[device].state = data;
            }
            return data;
        });
        ws.addEventListener("error", function() {
            console.log("Websocket error");
            intervalID = setTimeout(doConnect, 1000);
        });
        ws.addEventListener("close", function() {
            console.log("Websocket closed");
            intervalID = setTimeout(doConnect, 1000);
        });
    }

    function onKeyUp(event) {
        const key = event.key;
        if (key === " " || key === 32) {
            event.preventDefault();
            switchers[0].cutTransition();
        } else if (key === "Enter" || key === 13) {
            switchers[0].autoTransition();
        } else if (key >= "0" && key <= "9") {
            if (event.getModifierState("Control")) {
                switchers[0].changeProgramInput(key);
            } else {
                switchers[0].changePreviewInput(key);
            }
        }
    }

    onMount(() => {
        doConnect();
        document.addEventListener("keyup", onKeyUp)
    })
</script>



<Router url="{url}">
    <Route path="console">
        <Console ws="{ws}" switchers="{switchers}" />
    </Route>
    <Route path="camera">
        <Camera ws="{ws}" switchers="{switchers}" />
    </Route>
</Router>
