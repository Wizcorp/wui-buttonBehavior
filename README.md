# wuiButtonBehavior

## What it is

wuiButtonBehavior is a behavior made for WUI. It behaves like an HTML5 button would be expected to.
Setting the behavior to a [WuiDom](https://github.com/Wizcorp/wui-Dom) would make it able to listen for various events.

wuiButtonBehavior will attach methods and events to the WuiDom element;

```javascript
var button = new WuiDom('div');
wuiButtonBehavior(button);
```

## Methods

### enable

The enable method can be called to enable tap interaction.

```javascript
wuiButtonBehavior(button);
button.enable();
```

### disable

The disable method can be called to prevent tap interaction on the element.

```javascript
button.disable();
```

## Events

### tap

This event occurs when a successful tap by the user happened.
Most likely used to trigger action.


### tapstart

This event occurs when the user first presses the WuiDom.
Most likely used for design purpose.


### tapend

This event occurs when the user release the WuiDom he was pressing or when the tap got cancelled.
Most likely used for design purpose.


### enabled

The enabled event is called when the tap behavior is enabled, such as by the enable method.


### disabled

The disabled event is called when the tap behavior is disabled, such as by the disable method.


## How to use wuiButtonBehavior to create a button

See the example below:

```javascript
var WuiDom = require('WuiDom');
var wuiButtonBehavior = require('wuiButtonBehavior');

var btn = new WuiDom('div', { text: 'submit', className: 'button' });
wuiButtonBehavior(btn);

btn.on('tapstart', function () {
    btn.addClassNames('pressed');
});

btn.on('tapend', function () {
    btn.delClassNames('pressed');
});

btn.on('disabled', function () {
    btn.addClassNames('disabled');
});

btn.on('enabled', function () {
    btn.delClassNames('disabled');
});

btn.on('tap', function () {
    doSomething();
});
```