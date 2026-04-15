var TVID = (function () {
	const VERSION = torovid.version;
	const NONCE = torovid.nonce;
	const URL = torovid.url;

	var _console = function () {
		console.log(`${'\n'} %c TOROVID v${VERSION} %c built with love ${'\n'}`, 'color: #7289DA; background: #23272A; padding:4px 0;', 'background: #FFFFFF; padding:4px 0;');
	};

	var _search = function () {
		var reset = document.getElementById('s-delete');
		var inner = document.getElementById('s-results');

		if (reset !== null && inner !== null) {
			var input = document.getElementById('s');
			var clear = null;

			input.addEventListener('keyup', function (event) {
				clearTimeout(clear);

				clear = setTimeout(function () {
					fetch(URL, {
						method: 'POST',
						body: new URLSearchParams({
							action: 'action_search',
							s: input.value
						}),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						credentials: 'same-origin'
					})
						.then(function (response) {
							if (response.status == 200) {
								return response.json();
							} else {
								inner.parentElement.classList.add('dn');
								inner.innerHTML = '';
							}
						})
						.then(function (body) {
							const data = body;

							var result = '';

							if (Array.isArray(data) && data.length > 0) {
								data.forEach((element) => {
									result +=
										'<li><div class="mv sm dfx pd por z1 brd1 aic tertiary-bg-h"> <figure class="im brd1 mar1">' +
										element.src +
										'</figure> <div class="hd fg1"><div class="title tvw">' +
										element.details.name +
										'</div> <span class="db">' +
										element.details.type +
										'</span> </div> <a href="' +
										element.details.link +
										'" class="lnk-blk"><span class="dn">' +
										element.details.name +
										'</span></a> </div></li>';
								});

								inner.parentElement.classList.remove('dn');
								inner.innerHTML = result;
							}
						});
				}, 500);
			});

			reset.addEventListener('click', function (event) {
				clearTimeout(clear);

				inner.parentElement.classList.add('dn');
				inner.innerHTML = '';
			});
		}
	};

	var _source = function () {
		var mark = document.getElementById('drp-mark');

		if (mark !== null) {
			var post = mark.dataset.post;
			var type = mark.dataset.type;

			var sources = document.querySelectorAll('[data-source]');

			sources.forEach((element) => {
				element.addEventListener('click', function (event) {
					var evt = event.currentTarget;

					fetch(URL, {
						method: 'POST',
						body: new URLSearchParams({
							action: 'action_' + type,
							source: evt.dataset.source,
							post: post
						}),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						credentials: 'same-origin'
					})
						.then(function (response) {
							if (response.status == 200) {
								return response.json();
							}
						})
						.then(function (body) {
							const alert = document.getElementById('alerts');
							const data = body;

							switch (data.type) {
								case 'delete':
									evt.classList.remove('on');
									break;

								case 'insert':
									evt.classList.add('on');
									break;

								default: 

									break;
							}

							if (alert !== null && data) {
								const container = document.createElement('div');

								const btn = document.createElement('button');
								const div = document.createElement('div');

								btn.type = 'button';
								btn.classList = 'btn btn-sm fg0';
								btn.innerHTML = '<i class="fa-times"></i>';

								div.innerHTML = data.content;
								div.classList = 'fg1 mar1 fz3';
								container.classList = 'ntf pd1 brd1 white-co max1 may1 z3 dfx ais';

								container.appendChild(div);
								container.appendChild(btn);

								alert.appendChild(container);

								btn.addEventListener('click', function (event) {
									var evt = event.currentTarget;

									if (evt !== null) {
										evt.parentNode.remove();
									}
								});

								setTimeout(() => {
									container.remove();
								}, 5000);
							}
						});
				});
			});
		}
	};

	var _report = function () {
		var object = document.getElementById('fs-report');

		if (object !== null) {
			object.querySelector('[data-report]').addEventListener('click', function (event) {
				const elements = document.forms['fs-report'].elements;
				const data = {};

				for (i = 0; i < elements.length; i++) {
					if (elements[i].name) {
						data[elements[i].name] = elements[i].value;
					}
				}

				var form = new FormData();

				for (var k in data) {
					form.append(k, data[k]);
				}

				fetch(URL, {
					method: 'POST',
					headers: {
						'X-WP-Nonce': NONCE
					},
					credentials: 'same-origin',
					body: form
				})
					.then(function (response) {
						return response.json();
					})
					.then(function (body) {
						_closes();

						const alert = document.getElementById('alerts');
						const data = body;

						if (alert !== null) {
							const container = document.createElement('div');

							const btn = document.createElement('button');
							const div = document.createElement('div');

							btn.type = 'button';
							btn.classList = 'btn btn-sm fg0';
							btn.innerHTML = '<i class="fa-times"></i>';

							div.innerHTML = data.content;
							div.classList = 'fg1 mar1 fz3';
							container.classList = 'ntf pd1 brd1 white-co max1 may1 z3 dfx ais';

							container.appendChild(div);
							container.appendChild(btn);

							alert.appendChild(container);

							btn.addEventListener('click', function (event) {
								var evt = event.currentTarget;

								if (evt !== null) {
									evt.parentNode.remove();
								}
							});

							setTimeout(() => {
								container.remove();
							}, 5000);
						}
					});
			});
		}
	};

	var _closes = function (event) {
		var modals = document.querySelectorAll('.modal.mdl.anm-a.modalOn');

		modals.forEach((element) => {
			element.classList.remove('modalOn');
		});

		var query = document.querySelector('.modal-body.mdl-bd > div.embed');

		if (query) {
			query.innerHTML = query.innerHTML;
		}
	};

	var _modals = function () {
		var modals = document.querySelectorAll('[data-tgl]');

		modals.forEach((element) => {
			element.addEventListener('click', function (event) {
				var mv = event.currentTarget;

				if (mv !== null) {
					var mdl = document.getElementById(this.dataset.tgl);

					if (!mdl.classList.contains('modalOn')) {
						mdl.classList.add('modalOn');
					}
				}
			});
		});

		var closes = document.querySelectorAll('.close');

		closes.forEach((element) => {
			element.addEventListener('click', function (event) {
				_closes();
			});
		});

		document.addEventListener('keydown', function (event) {
			if (event.keyCode === 27) {
				_closes();
			}
		});
	};

	var _videos = function () {
		var player = document.getElementById('playback');

		if (player !== null) {
			var options = document.querySelectorAll('[data-option]');

			options.forEach((element) => {
				element.addEventListener('click', function (event) {
					var mv = event.currentTarget;

					if (mv !== null) {
						var plyr = document.querySelector('[data-player]');
						var backlink = document.getElementById('backlink');

						if (plyr !== null) {
							const element = document.createElement('iframe');
							const embed = event.target.parentNode.parentNode;

							element.src = window.atob(mv.dataset.src);
							element.width = 560;
							element.height = 315;

							element.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

							element.setAttribute('frameborder', 0);
							element.setAttribute('allowfullscreen', 1);

							plyr.appendChild(element);
						}

						player.classList.add('on');
						player.classList.remove('dn');

						backlink.classList.add('dn');
						backlink.classList.remove('on');
					}
				});
			});

			var tpnv = player.querySelector('div > button');

			tpnv.addEventListener('click', function (event) {
				var plyr = document.querySelector('[data-player]');
				var backlink = document.getElementById('backlink');

				if (plyr !== null) {
					plyr.innerHTML = '';
				}

				player.classList.add('dn');
				player.classList.remove('on');

				backlink.classList.add('on');
				backlink.classList.remove('dn');
			});
		}
	};

	var _links = function () {
		var links = document.querySelectorAll('[data-link]');

		links.forEach((element) => {
			element.addEventListener('click', function (event) {
				var mv = event.currentTarget;

				if (mv !== null) {
					window.open(window.atob(mv.dataset.url));
				}
			});
		});
	};

	var _ax = function () {
		if (document.getElementById('fs-signin') !== null ? true : false) {
			document.querySelector('[data-signin]').addEventListener('click', function (event) {
				const elements = document.forms['fs-signin'].elements;
				const data = {};

				for (i = 0; i < elements.length; i++) {
					if (elements[i].name) {
						data[elements[i].name] = elements[i].value;
					}
				}

				var form = new FormData();

				for (var k in data) {
					form.append(k, data[k]);
				}

				fetch(URL, {
					method: 'POST',
					headers: {
						'X-WP-Nonce': NONCE
					},
					credentials: 'same-origin',
					body: form
				})
					.then(function (response) {
						return response.json();
					})
					.then(function (body) {
						const data = body;

						switch (data.type) {
							case 200:
								location.reload();
								break;

							default:
								const alert = document.getElementById('alerts');

								if (alert !== null) {
									const container = document.createElement('div');

									const btn = document.createElement('button');
									const div = document.createElement('div');

									btn.type = 'button';
									btn.classList = 'btn btn-sm fg0';
									btn.innerHTML = '<i class="fa-times"></i>';

									div.innerHTML = data.content;
									div.classList = 'fg1 mar1 fz3';
									container.classList = 'ntf pd1 brd1 white-co max1 may1 z3 dfx ais';

									container.appendChild(div);
									container.appendChild(btn);

									alert.appendChild(container);

									btn.addEventListener('click', function (event) {
										var evt = event.currentTarget;

										if (evt !== null) {
											evt.parentNode.remove();
										}
									});

									setTimeout(() => {
										container.remove();
									}, 5000);
								}
								break;
						}
					});
			});
		}

		if (document.getElementById('fs-signup') !== null ? true : false) {
			document.querySelector('[data-signup]').addEventListener('click', function (event) {
				const elements = document.forms['fs-signup'].elements;
				const data = {};

				for (i = 0; i < elements.length; i++) {
					if (elements[i].name) {
						data[elements[i].name] = elements[i].value;
					}
				}

				var form = new FormData();

				for (var k in data) {
					form.append(k, data[k]);
				}

				fetch(URL, {
					method: 'POST',
					headers: {
						'X-WP-Nonce': NONCE
					},
					credentials: 'same-origin',
					body: form
				})
					.then(function (response) {
						return response.json();
					})
					.then(function (body) {
						const data = body;

						switch (data.type) {
							case 200:
								location.reload();
								break;

							default:
								const alert = document.getElementById('alerts');

								if (alert !== null) {
									const container = document.createElement('div');

									const btn = document.createElement('button');
									const div = document.createElement('div');

									btn.type = 'button';
									btn.classList = 'btn btn-sm fg0';
									btn.innerHTML = '<i class="fa-times"></i>';

									div.innerHTML = data.content;
									div.classList = 'fg1 mar1 fz3';
									container.classList = 'ntf pd1 brd1 white-co max1 may1 z3 dfx ais';

									container.appendChild(div);
									container.appendChild(btn);

									alert.appendChild(container);

									btn.addEventListener('click', function (event) {
										var evt = event.currentTarget;

										if (evt !== null) {
											evt.parentNode.remove();
										}
									});

									setTimeout(() => {
										container.remove();
									}, 5000);
								}
								break;
						}
					});
			});
		}
	};

	return {
		init: function () {
			_console();

			_search();
			_source();
			_report();

			_modals();

			_videos();
			_links();

			_ax();
		}
	};
})();

/** Webpack */
if (typeof module !== 'undefined') {
	module.exports = TVID;
}

/** Vanilla */
if (window.addEventListener) {
	window.addEventListener('ready', TVID.init(), false);
} else {
	window.onload = TVID.init();
}
