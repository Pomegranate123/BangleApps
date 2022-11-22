var sendTrigger = function(data) {
  Bluetooth.println(""); // Make sure nothing else is already on the line we're gonna be printing oni
  Bluetooth.println(JSON.stringify({
    t:"intent",
    action:"com.espruino.gadgetbridge.banglejs.HA",
    extra: data,
  }));
  Bangle.buzz();
};

require("sched").setAlarms = function(alarms) {
  updateAlarms(alarms);
  return require("Storage").writeJSON("sched.json",alarms);
};

var updateAlarms = function(alarms) {
  var days = [];
  for (var day = 0; day < 7; day++) {
    var alarm = alarms.filter(a =>
      (a.dow >> day) & 1
    ).sort((a,b) => a.t - b.t)[0];
    if (alarm) {
      var hours = Math.floor(alarm.t / 3600000);
      var mins = (alarm.t % 3600000) / 60000;
      days.push({ on: alarm.on, time: `${hours}:${mins}:00` });
    } else {
      days.push({ on: false, time: "12:00:00"});
    }
  }
  sendTrigger({trigger: "ALARM", days });
};
