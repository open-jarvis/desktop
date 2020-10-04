const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://jarvis.local:1883");

client.subscribe("jarvis/hotword");
client.on("message", (topic, message) => {
	console.log(message.toString());
});