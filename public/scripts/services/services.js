angular.module('app')
  
  .service('SpinService', function() {
    
    var opts = {
      lines: 20, // The number of lines to draw
      length: 50, // The length of each line
      width: 25, // The line thickness
      radius: 80, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: "#95A5A6", // #rgb or #rrggbb or array of colors
      speed: 0.9, // Rounds per second
      trail: 30, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };

    var spinner = new Spinner(opts);

    this.spin = function(){
      console.log("Spinning");
      var target = document.getElementById('test');
      spinner.spin(target);
    };

    this.stop = function(){
      console.log("Stopped Spinning");
      var target = document.getElementById('test');
      spinner.stop(target);
    };
  });