function aicpCookieGet(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function aicpCookieSet(cname,cvalue,exhours) {
	var d = new Date();
	d.setTime(d.getTime() + (exhours*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";	
}

function aicpCookieCheck(ccook, limit, delay) {
	if (ccook != "") {
		if (parseInt(ccook) >= limit) {
			aicpHideAds();
		}
	} else {
		aicpServeAds(delay);
	}
}

function aicpHideAds() {
	jQuery( "ins.adsbygoogle" ).each(function() {
		jQuery(this).hide();
	});
}

function aicpServeAds(delay) {
	setTimeout(function() {
		jQuery( "ins.adsbygoogle" ).each(function() {
			(adsbygoogle = window.adsbygoogle || []).push({});
		});
	}, delay);
}

var cookieName = aicpConfig.cookie;
var serveDelay = parseInt(aicpConfig.delay);
var cookieHours = parseInt(aicpConfig.duration);
var clickCount = parseInt(aicpConfig.limit);

var aicpcook = aicpCookieGet(cookieName);
aicpCookieCheck(aicpcook, clickCount, serveDelay);
jQuery(document).ready(function() {
	setTimeout(function() {aicpCookieCheck(aicpcook, clickCount, serveDelay);}, 2000);
	setTimeout(function() {aicpCookieCheck(aicpcook, clickCount, serveDelay);}, 4000);
	setTimeout(function() {aicpCookieCheck(aicpcook, clickCount, serveDelay);}, 8000);
});

setInterval( function() {
	var elem = document.activeElement;
	if(elem.tagName == 'IFRAME'){
		if(elem){
			var countnow = parseInt(aicpCookieGet(cookieName));
			if (!countnow) { countnow = 0; }
			countnow++;
			if (countnow >= clickCount) {
				aicpHideAds();
			}
			aicpCookieSet(cookieName, countnow + " click", cookieHours); 
			document.activeElement.blur();
		}
	}
}, 1000);