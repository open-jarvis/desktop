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


get("http://jarvis.local:1884/discovery", { timeout: 10000, ontimeout: _ => {
	document.querySelector("#status > span").classList.add("red");
	document.querySelector("#status > span").innerHTML = `Couldn't find Jarvis instance!`
} }).then(d => {
	d = JSON.parse(d);

	if (d.success) {
		document.querySelector("#status > span").classList.remove("blue");
		if (d.jarvis != "") {
			document.querySelector("#status > span").innerHTML = `Found Jarvis at ${d.jarvis}`;
			document.querySelector("#status > span").classList.add("green");
		} else {
			document.querySelector("#status > span").innerHTML = `Found Jarvis`;
			document.querySelector("#status > span").classList.add("green");
		}

		setTimeout(function() {
			document.querySelector("#status").classList.add("hidden");
		}, 2000);

		siriSilent();
	}
}).catch(e => {
	document.querySelector("#status > span").classList.add("red");
	document.querySelector("#status > span").innerHTML = `Couldn't find Jarvis instance!`
});