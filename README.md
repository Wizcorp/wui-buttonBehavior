# wuiButtonBehavior

## What it is

wuiButtonBehavior is a behavior made for WUI. It behaves like an HTML5 button would be expected to.
Setting the behavior to a [WuiDom](https://github.com/Wizcorp/wui-Dom) would make it able to listen for various events.

wuiButtonBehavior will attach methods and events to the WuiDom element;

```javascript
var button = new WuiDom('div');
wuiButtonBehavior(button);
```
[See the full example at the end of the file](#how-to-use)


## Methods

### enable

The enable method can be called to enable tap interaction.

```javascript
function Button() {
    WuiDom.call(this);
    wuiButtonBehavior(this);
}
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
It receives a boolean as parameter which will be set to `true` if the tap has been cancelled.
Most likely used for design purpose.


### enabled

The enabled event is called when the tap behavior is enabled, such as by the enable method.


### disabled

The disabled event is called when the tap behavior is disabled, such as by the disable method.


## How to use

See the example below:

```javascript
var inherits = require('util').inherits;
var WuiDom = require('WuiDom');
var wuiButtonBehavior = require('wuiButtonBehavior');

function Button(label) {
    WuiDom.call(this, 'div', { text: label, className: 'button' });
    wuiButtonBehavior(this);

    this.on('tapstart', function () {
        this.addClassNames('pressed');
    });

    this.on('tapend', function () {
        this.delClassNames('pressed');
    });

    this.on('disabled', function () {
        this.addClassNames('disabled');
    });

    this.on('enabled', function () {
        this.delClassNames('disabled');
    });
}

inherits(Button, WuiDom);

var button = new Button('My Button');

button.on('tap', function () {
    doSomething();
});
```