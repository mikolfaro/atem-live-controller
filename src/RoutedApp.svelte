<script>
    import { onMount } from "svelte";
    import { Router, Route } from "svelte-routing";

    import Camera from "./routes/Camera.svelte"
    import Console from "./routes/Console.svelte"
    import {ATEM} from "./atem";
    import Intercom from "./intercom";

    export let url = ""
    let switchers = [];
    let ws = { readyState: 0};
    let intercom;
    let intervalID = 0;

    function doConnect() {
        console.debug("Opening websocket...");
        let url  = window.location + "";
        url = url.slice(0, url.lastIndexOf("/"));
        url = url.replace("http", "ws");
        ws = new WebSocket(url + "/ws");
        intervalID = clearTimeout(intervalID);
        ws.addEventListener("open", function(event) {
            console.log("Websocket opened");
            intervalID = clearTimeout(intervalID);
            switchers[0] = new ATEM();
            switchers[0].setWebsocket(ws);
            intercom = new Intercom(ws);
            // update svelte
            ws = ws;
        });
        ws.addEventListener("message", function(event) {
            let data = JSON.parse(event.data);
            let device = data.device || 0;
            switch (data.method) {
                case 'connect':
                    switchers[device].connected = true;
                    break;
                case 'disconnect':
                    switchers[device].connected = false;
                    break;
                case 'alertOn':
                    console.log("AlertOn", data)
                    intercom.alertOn(data.params.cam)
                    intercom = intercom
                    break;
                case 'alertOff':
                    console.log("AlertOff", data)
                    intercom.alertOff(data.params.cam)
                    intercom = intercom
                    break;
                default:
                    switchers[device].connected = true;
                    switchers[device].state = data;
                    break;
            }
            return data;
        });
        ws.addEventListener("error", function() {
            if (!intervalID) {
                console.log("Websocket error");
                intervalID = setTimeout(doConnect, 1000);
            }
        });
        ws.addEventListener("close", function() {
            if (!intervalID) {
                console.log("Websocket closed");
                intervalID = setTimeout(doConnect, 1000);
            }
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
        <Console ws="{ws}" switchers="{switchers}" intercom="{intercom}" />
    </Route>
    <Route path="camera">
        <Camera ws="{ws}" switchers="{switchers}" intercom="{intercom}" />
    </Route>
</Router>
