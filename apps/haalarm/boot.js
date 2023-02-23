var sendTrigger = function(data) {
  Bluetooth.println(""); // Make sure nothing else is already on the line we're gonna be printing on
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
  var data = [];
  // Select earliest alarm with message "Wekker"
  var alarm = alarms.filter(a => a.msg == "Wekker"
  ).sort((a,b) => a.t - b.t)[0];
  if (alarm) {
    var hours = Math.floor(alarm.t / 3600000);
    var mins = (alarm.t % 3600000) / 60000;
    data.push({ on: alarm.on, time: `${hours}:${mins}:00` });
    sendTrigger({trigger: "Wekker", data });
  }
};
