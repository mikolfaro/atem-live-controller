export default class Intercom {
    constructor(websocket) {
        this.websocket = websocket
        this.cams = {}
    }

    sendMessage(data) {
        if (this.websocket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify(data);
            // console.log('sendMessage', message);
            this.websocket.send(message);
        } else {
            console.warn('Websocket is closed. Cannot send message.')
        }
    }

    toggleAlert(cam) {
        if (!this.cams[cam]) {
            this.cams[cam] = {alert: false}
        }
        this.cams[cam].alert = !this.cams[cam].alert

        if (this.cams[cam].alert) {
            this.sendMessage({ method: 'alertOn', params: { cam: cam } })
        } else {
            this.sendMessage({ method: 'alertOff', params: { cam: cam } })
        }

        console.log(this)

        return this.cams[cam].alert
    }
}
