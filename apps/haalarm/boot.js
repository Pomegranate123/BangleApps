var sendTrigger = function(data) {
  var retries = 3;
  while (retries > 0) {
    try {
      Bluetooth.println(); // Make sure nothing else is already on the line we're gonna be printing on
      Bluetooth.println(JSON.stringify({
        t:"intent",
        action:"com.espruino.gadgetbridge.banglejs.HA",
        extra: data,
      }));
      retries = -1;
      Bangle.buzz();
    } catch(e) {
        Bangle.buzz(1000);
        retries--;
    }
  }
};

require("sched").setAlarms = function(alarms) {
  updateAlarms(alarms);
  return require("Storage").writeJSON("sched.json",alarms);
};

var updateAlarms = function(alarms) {
  var days = [];
  for (var day = 0; day < 7; day++) {
    var alarm = alarms.filter(a=>a.on).filter(a=>
      (a.dow >> day) & 1
    ).sort(a=>a.t)[0];
    if (alarm) {
      var hours = Math.floor(alarm.t / 3600000);
      var mins = (alarm.t % 3600000) / 60000;
      days.push({ on: true, hours, mins });
    } else {
      days.push({ on: false, hours: 12, mins: 0});
    }
  }
  sendTrigger({trigger: "ALARM", days });
};
