const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const ATEM       = require('applest-atem');
const config     = require('../config.json');

let atem;
const switchers = [];
for (var switcher of config.switchers) {
  atem = new ATEM;
  atem.event.setMaxListeners(5);
  atem.connect(switcher.addr, switcher.port);
  switchers.push(atem);
}

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../public'));

app.get('/api/channels', (req, res) => res.send(JSON.stringify(config.channels)));

app.get('/api/switchersState', (req, res) => {
    const result = [];
    for (atem of switchers) {
        result.push(atem.state);
    }
    res.send(JSON.stringify(result));
  }
);

app.get('/api/switchersStatePolling', (req, res) => {
    const result = [];
    for (atem of switchers) {
      result.push(
        atem.once('stateChanged', (err, state) => {
          const result1 = [];
          for (atem of switchers) {
            result1.push(atem.state);
          }
          res.end(JSON.stringify(result1))
        })
      );
    }
    return result;
  }
);

app.post('/api/changePreviewInput', function(req, res) {
  const { device } = req.body;
  const { input }  = req.body;
  switchers[device].changePreviewInput(input);
  return res.send('success');
});

app.post('/api/changeProgramInput', function(req, res) {
  const { device } = req.body;
  const { input }  = req.body;
  switchers[device].changeProgramInput(input);
  return res.send('success');
});

app.post('/api/autoTransition', function(req, res) {
  const { device } = req.body;
  switchers[device].autoTransition();
  return res.send('success');
});

app.post('/api/cutTransition', function(req, res) {
  const { device } = req.body;
  switchers[device].cutTransition();
  return res.send('success');
});

app.post('/api/changeTransitionPosition', function(req, res) {
  const { device }   = req.body;
  const { position } = req.body;
  switchers[device].changeTransitionPosition(position);
  return res.send('success');
});

app.post('/api/changeTransitionType', function(req, res) {
  const { type } = req.body;
  for (switcher of switchers) {
    switcher.changeTransitionType(type);
  }
  return res.send('success');
});

app.post('/api/changeUpstreamKeyState', function(req, res) {
  const { device } = req.body;
  const { number } = req.body;
  const { state }  = req.body;
  switchers[device].changeUpstreamKeyState(number, state);
  return res.send('success');
});

app.post('/api/changeUpstreamKeyNextBackground', function(req, res) {
  const { device } = req.body;
  const { state }  = req.body;
  switchers[device].changeUpstreamKeyNextBackground(state);
  return res.send('success');
});

app.post('/api/changeUpstreamKeyNextState', function(req, res) {
  const { device } = req.body;
  const { number } = req.body;
  const { state }  = req.body;
  switchers[device].changeUpstreamKeyNextState(number, state);
  return res.send('success');
});

app.post('/api/changeDownstreamKeyOn', function(req, res) {
  const { device } = req.body;
  const { number } = req.body;
  const { state }  = req.body;
  switchers[device].changeDownstreamKeyOn(number, state);
  return res.send('success');
});

app.post('/api/changeDownstreamKeyTie', function(req, res) {
  const { device } = req.body;
  const { number } = req.body;
  const { state }  = req.body;
  switchers[device].changeDownstreamKeyTie(number, state);
  return res.send('success');
});

app.post('/api/autoDownstreamKey', function(req, res) {
  const { device } = req.body;
  const { number } = req.body;
  switchers[device].autoDownstreamKey(number);
  return res.send('success');
});

app.listen(8080);
