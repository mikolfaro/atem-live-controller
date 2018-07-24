angular
  .module('liveController', [])
  .controller('MainCtrl', ['$scope', '$http', '$interval', '$timeout',
    function($scope, $http, $interval, $timeout) {
      const defaultSuccess = function(data) {};
        // console.log(data)

      const findChannel = function(device, input) {
        for (let channel of $scope.channels) {
          if ((channel.device === device) && (channel.input === input)) { return channel; }
        }
      };

      const findChainChannel = function(device, targetDevice) {
        for (let channel of $scope.channels) {
          if ((channel.device === device) && (channel.chainDevice === targetDevice)) { return channel; }
        }
      };

      const getParentProgramChannel = () => findChannel(0, $scope.state[0].video.ME[0].programInput);

      const getVirtualProgramChannel = function() {
        const parentProgramChannel = findChannel(0, $scope.state[0].video.ME[0].programInput);
        if (parentProgramChannel.chainDevice != null) {
          return findChannel(parentProgramChannel.chainDevice, $scope.state[parentProgramChannel.chainDevice].video.ME[0].programInput);
        } else {
          return findChannel(0, $scope.state[0].video.ME[0].programInput);
        }
      };

      const getVirtualPreviewChannel = function() {
        const parentProgramChannel = findChannel(0, $scope.state[0].video.ME[0].programInput);
        const parentPreviewChannel = findChannel(0, $scope.state[0].video.ME[0].previewInput);
        if ((parentPreviewChannel.chainDevice != null) && (parentProgramChannel.chainDevice === parentPreviewChannel.chainDevice)) {
          return findChannel(parentPreviewChannel.chainDevice, $scope.state[parentPreviewChannel.chainDevice].video.ME[0].previewInput);
        } else if (parentPreviewChannel.chainDevice != null) {
          return findChannel(parentPreviewChannel.chainDevice, $scope.state[parentPreviewChannel.chainDevice].video.ME[0].programInput);
        } else {
          return findChannel(0, $scope.state[0].video.ME[0].previewInput);
        }
      };

      const getTransitionDevice = function() {
        const parentProgramChannel = findChannel(0, $scope.state[0].video.ME[0].programInput);
        const parentPreviewChannel = findChannel(0, $scope.state[0].video.ME[0].previewInput);
        console.log(parentProgramChannel, parentPreviewChannel);
        if ((parentPreviewChannel.chainDevice != null) && (parentProgramChannel.chainDevice === parentPreviewChannel.chainDevice)) {
          return parentPreviewChannel.chainDevice;
        } else {
          return 0;
        }
      };

      $scope.isProgramChannel = function(channel) {
        const programChannel = getVirtualProgramChannel();
        return (programChannel.device === channel.device) && (programChannel.input === channel.input);
      };

      $scope.isPreviewChannel = function(channel) {
        const previewChannel = getVirtualPreviewChannel();
        return (previewChannel.device === channel.device) && (previewChannel.input === channel.input);
      };

      $scope.getChannelInput = channel => $scope.state[channel.device].channels[channel.input];

      const changePreviewInput = (device, input) => $http.post('/api/changePreviewInput', {device, input}).success(defaultSuccess);

      const changeProgramInput = (device, input) => $http.post('/api/changeProgramInput', {device, input}).success(defaultSuccess);

      $scope.changeInput = function(channel) {
        const isParentDevice = channel.device === 0;
        if (isParentDevice) {
          return changePreviewInput(0, channel.input);
        } else {
          const chainChannel = findChainChannel(0, channel.device);
          changePreviewInput(chainChannel.device, chainChannel.input);
          if (getParentProgramChannel().chainDevice === channel.device) {
            return changePreviewInput(channel.device, channel.input);
          } else {
            return changeProgramInput(channel.device, channel.input);
          }
        }
      };

      $scope.autoTransition = (device = getTransitionDevice()) => $http.post('/api/autoTransition', {device}).success(defaultSuccess);

      $scope.cutTransition = (device = getTransitionDevice()) => $http.post('/api/cutTransition', {device}).success(defaultSuccess);

      $scope.changeTransitionPosition = (percent, device = getTransitionDevice()) => $http.post('/api/changeTransitionPosition', {device, position: parseInt(percent*10000)}).success(defaultSuccess);

      $scope.changeTransitionType = type => $http.post('/api/changeTransitionType', {type}).success(defaultSuccess);

      $scope.toggleUpstreamKeyNextBackground = function() {
        const state = !$scope.state[0].video.ME[0].upstreamKeyNextBackground;
        return $http.post('/api/changeUpstreamKeyNextBackground', {device: 0, state}).success(defaultSuccess);
      };

      $scope.toggleUpstreamKeyNextState = function(number) {
        const state = !$scope.state[0].video.ME[0].upstreamKeyNextState[number];
        return $http.post('/api/changeUpstreamKeyNextState', {device: 0, number, state}).success(defaultSuccess);
      };

      $scope.toggleUpstreamKeyState = function(number) {
        const state = !$scope.state[0].video.ME[0].upstreamKeyState[number];
        return $http.post('/api/changeUpstreamKeyState', {device: 0, number, state}).success(defaultSuccess);
      };

      $scope.toggleDownstreamKeyTie = function(number) {
        const state = !$scope.state[0].video.downstreamKeyTie[number];
        return $http.post('/api/changeDownstreamKeyTie', {device: 0, number, state}).success(defaultSuccess);
      };

      $scope.toggleDownstreamKeyOn = function(number) {
        const state = !$scope.state[0].video.downstreamKeyOn[number];
        return $http.post('/api/changeDownstreamKeyOn', {device: 0, number, state}).success(defaultSuccess);
      };

      $scope.autoDownstreamKey = function(number) {
        return $http.post('/api/autoDownstreamKey', {device: 0, number}).success(defaultSuccess);
      }

      registerSlider((err, percent) => $scope.changeTransitionPosition(percent));

      $scope.refresh = () =>
        $http.get('/api/switchersStatePolling').success(function(data) {
          $scope.state = data;
          return $timeout($scope.refresh, 0);
        })
      ;
      $timeout($scope.refresh, 0);

      $interval( function() {
        $http.get('/api/switchersState').success(data => $scope.state = data)
      }
      , 500);

      $interval( function() {
        const date    = new Date();
        const hours   = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const seconds = (`0${date.getSeconds()}`).slice(-2);
        return $scope.time = `${hours}:${minutes}:${seconds}`;
      }
      , 1000);

      return $http.get('/api/channels').success(data => $scope.channels = data);
    }
  ]);
