// system wide, can't tap another button

var disableAll = false;

// system wide, one can only tap one button at a time

var current = null;

function getTouchPos(domEvent) {
	var targetTouch = domEvent.targetTouches ? domEvent.targetTouches[0] : null;

	if (targetTouch) {
		domEvent = targetTouch;
	}

	return { x: domEvent.pageX, y: domEvent.pageY, screenX: domEvent.screenX, screenY: domEvent.screenY };
}


function setActiveButton(button) {
	if (current) {
		current.emit('tapend', true);
	}

	current = button;
}

function setDisableAll(repeatDelay) {
	if (repeatDelay !== null && repeatDelay >= 0) {
		disableAll = true;
		window.setTimeout(function () {
			disableAll = false;
		}, repeatDelay);
	}
}

/**
 * buttonBehavior is wuiButtonBehavior
 * @param {WuiDom} button - a component to turn into a button
 * @param {Object} [options] - a map with the following (all optional) properties:
 * @param {Boolean} [options.disabled=false] - the button starts as unresponsive (call .enable() to turn it on)
 * @param {Number} [options.tapDelay] - the delay in msec before tap is emitted (disabled by default).
 * @param {Number} [options.repeatDelay] - the delay before which a button is tappable again (disabled by default).
 * @param {Boolean} [options.isRepeatable=false] - the button emits tap events when held down (default: false).
 * @param {Number} [options.repeatableInitialDelay=500] - the delay in msec before the button begins repeating.
 * @param {Number} [options.repeatableDelay=200] - the delay in msec for subsequent repeats
 * @param {Object} [options.toggle]
 * @param {Array} options.toggle.values - all values the button can toggle between, which are emitted through the
 * toggle event that fires immediately after the tap event.
 * @param {*} [options.toggle.defaultValue] - the value that the toggle-button starts with (default: first value).
 */
function buttonBehavior(button, options) {
	// parse options

	if (!options) {
		options = {};
	}

	// option: disabled (off by default, can be true in order to disable the button from the start)

	var isEnabled = !options.disabled;

	// option: tapDelay (delay in msec after which tap events are emitted)

	var tapDelay = (typeof options.tapDelay === 'number') ? options.tapDelay : null;

	var repeatDelay = (typeof options.repeatDelay === 'number') ? options.repeatDelay : null;

	var isRepeatable = options.isRepeatable ? options.isRepeatable : false;

	var repeatableInitialDelay = (typeof options.repeatableInitialDelay === 'number') ? options.repeatableInitialDelay : 500;

	var repeatableDelay = (typeof options.repeatableDelay === 'number') ? options.repeatableDelay : 200;

	var maxScrolling = (typeof options.maxScrolling === 'number') ? options.maxScrolling : 10;

	// This holds our repeatable timer so we can cancel it on tapend.
	var repeatableTimeout;

	// option: toggle (emits "togggle" event and iterates through given values)
	// eg: { values: [1,2,3,4], defaultValue: 3 }

	if (options.toggle) {
		var toggle = options.toggle;
		var selectedIndex = toggle.hasOwnProperty('defaultValue') ? toggle.values.indexOf(toggle.defaultValue) : 0;

		button.on('tap', function () {
			selectedIndex += 1;

			if (selectedIndex >= toggle.values.length) {
				selectedIndex = 0;
			}

			button.emit('toggle', toggle.values[selectedIndex]);
		});
	}

	// set up button-wide variables and start the Dom event system

	var startPos;
	var bounding;
	var pageOffset;
	var fnOverride;

	button.allowDomEvents();


	// enabling/disabling the button

	button.enable = function () {
		isEnabled = true;

		button.emit('enabled');
	};


	button.disable = function () {
		// disabling while being tapped should trigger a cancel

		if (current === button) {
			button.emit('tapend', true);
		}

		isEnabled = false;

		var argLen = arguments.length;

		if (argLen === 0) {
			button.emit('disabled');
		} else if (argLen === 1) {
			button.emit('disabled', arguments[0]);
		} else {
			var args = new Array(argLen + 1);

			args[0] = 'disabled';

			for (var i = 0; i < argLen; i += 1) {
				args[i + 1] = arguments[i];
			}

			button.emit.apply(button, args);
		}
	};


	// tap override callback management

	button.startTapOverride = function (fn) {
		fnOverride = fn;
	};


	button.stopTapOverride = function () {
		fnOverride = null;
	};


	function cancelTap() {
		if (current === button) {
			return button.emit('tapend', true);
		}
	}


	button.on('dom.touchstart', function touchstart(domEvent) {
		if (!isEnabled || disableAll) {
			return;
		}

		// if another button was active, cancel it and make this button the active one
		setActiveButton(button);

		// prevent other buttons to fire during a certain time (repeatDelay)
		setDisableAll(repeatDelay);

		startPos = getTouchPos(domEvent);

		bounding = button.rootElement.getBoundingClientRect();
		pageOffset = { x: window.pageXOffset, y: window.pageYOffset };

		button.removeListener('dom.mouseleave', cancelTap);
		button.once('dom.mouseleave', cancelTap);
		button.emit('tapstart');
	});


	button.on('dom.touchmove', function touchmove(domEvent) {
		if (!isEnabled || !current || !startPos) {
			return;
		}

		// Check if we scrolled too much

		var x = Math.abs(window.pageXOffset - pageOffset.x);
		var y = Math.abs(window.pageYOffset - pageOffset.y);

		var scrolledOut = x > maxScrolling || y > maxScrolling;
		if (scrolledOut) {
			return button.emit('tapend', true);
		}

		// Check if we moved outside the button

		var currentPos = getTouchPos(domEvent);

		var left = bounding.left + pageOffset.x;
		var top = bounding.top + pageOffset.y;

		var hasMoved =
			left > currentPos.x ||
			currentPos.x > left + bounding.width ||
			top > currentPos.y ||
			currentPos.y > top + bounding.height;

		if (hasMoved) {
			return button.emit('tapend', true);
		}
	});


	button.on('dom.touchend', function touchend() {
		if (!isEnabled) {
			return;
		}

		if (button === current) {
			button.emit('tapend', false);
		}
	});


	button.on('dom.touchcancel', function touchcancel() {
		if (!isEnabled) {
			return;
		}

		button.emit('tapend', true);
	});

	button.on('tapstart', function () {
		if (isRepeatable) {
			// We do an initial tap and then wait for the initial delay.
			button.emit('tap');
			repeatableTimeout = window.setTimeout(repeatTap, repeatableInitialDelay);
		}
	});

	function repeatTap() {
		// Send another tap and wait for the shorter delay.
		button.emit('tap');
		repeatableTimeout = window.setTimeout(repeatTap, repeatableDelay);
	}

	button.on('tapend', function (wasCancelled) {
		// could be called by other sources, or multiple times

		current = null;
		startPos = null;

		if (isRepeatable) {
			window.clearTimeout(repeatableTimeout);
			repeatableTimeout = null;
			return;
		}

		if (wasCancelled) {
			return;
		}

		// tap success!

		if (fnOverride) {
			fnOverride();
		} else {
			if (tapDelay === null) {
				button.emit('tap');
			} else {
				window.setTimeout(function () {
					button.emit('tap');
				}, tapDelay);
			}
		}
	});
}

module.exports = buttonBehavior;
