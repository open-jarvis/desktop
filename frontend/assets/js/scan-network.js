function get(url, args={}) {
	url = (url.includes("?") ? url + "&_no_cache=" + Date.now() : url + "?_no_cache=" + Date.now());
	console.log("[get]", url);
	return new Promise(function(accept, reject) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					accept(xmlHttp.responseText)
				} else {
					reject();
				}
			}
		}

		for (x in args) {
			xmlHttp[x] = args[x];
		}

		xmlHttp.open("GET", url, true); 
		xmlHttp.send(null);
	});
}



const startedIPs = []

function discovery(firstTime=true) {
	get("http://jarvis.local:1884/discovery", { timeout: 10000, ontimeout: _ => {
		StatusDot.RED;
		setTimeout(_=>{discovery(false)}, 5000);
	} }).then(d => {
		d = JSON.parse(d);
		
		if (d.success) {
			document.querySelector("#status-dot").classList.add("green");
			
			
			get("http://jarvis.local:1884/list-devices").then(d => {
				d = JSON.parse(d);
				
				if (d.success) {
					d.devices.forEach(device => {
						if (startedIPs.indexOf(device.ip) > -1) {
							return;
						}

						startedIPs.push(device.ip);
						if (	device.type == "mobile" 
							&& 	device.status == "green" 
							&& 	device.connection == "app") {	// mobile phone with notifications
							mobilePhone(device.ip);
						}
					});
				}
			}).catch(_=>{});
			
			Siri.SILENT;
			StatusDot.GREEN;
		} else {
			StatusDot.ORANGE;
		}
		
		setTimeout(_=>{discovery(false)}, 5000);
	}).catch(e => {
		StatusDot.RED;
		setTimeout(_=>{discovery(false)}, 5000);
	});
}
Siri.OFF;
discovery(true);



const EXCLUDED_APPS = [
	"Android-System",
	"Google",
	"Oberfläche",
	"AccuBattery"
];
function mobilePhone(ip) {
	get("http://" + ip + ":9000/getNotifications").then(d => {
		d = JSON.parse(d);

		let code = "";

		d.forEach(notification => {
			if (notification.title == null
					|| EXCLUDED_APPS.indexOf(notification.sender) > -1) { return; }

			code += `<div class="notification" onclick="showNotification(this, '${notification.title.replace("'", "\\'")}', '${notification.message.replace("'", "\\'")}')">
						<img draggable="false" src="data:image/jpeg;base64,${notification.icon}">
					</div>`;
		});

		document.querySelector("#notifications").classList.add("visible");
		document.querySelector("#notifications").innerHTML = code;

		setTimeout(_=>{mobilePhone(ip)}, 2000);
	}).catch(e => {
		setTimeout(_=>{mobilePhone(ip)}, 2000);
	});
}
let lastElement = null;
document.querySelector("body").addEventListener("click", e => {
	if (
		// document.querySelector("#notification-details").contains(e.target)
		// ||
		document.querySelector("#notifications").contains(e.target)
		) {

	} else {
		hideNotifications();
	}
})
function showNotification(element, title, message) {
	if (lastElement == element) { hideNotifications(); }
	lastElement = element;
	document.querySelector("#notification-details > .content").innerHTML = `<p>${title}</p><p>${message}</p>`
	document.querySelector("#notification-details").classList.add("visible");
	document.querySelector("#notification-details > .rect")
}
function hideNotifications() {
	document.querySelector("#notification-details").classList.remove("visible");
}