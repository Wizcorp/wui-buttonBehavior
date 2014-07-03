# Release history

## vNext

### About the dark scroll
Adding a max allowed scrolling value to cancel the tap.


## v0.1.3

### I care about you deeply
Changing within the way we care about imbricated buttons. The deepest will be taken.

### Faking is not lying
Implemented a new method called `tap` to trigger the tap cycle events.


## v0.1.2

### Cancel me if you can, but only if you should
The implementation of cancelling the tap event when moving has been revisited for better support of desktop browser.
The `maxDeviation` wasn't good enough, now it will detect if the cursor/finger leave the button.
Also added cancellation when scrolling farther than the button size.


## v0.1.1

### Mouse can leave too
`tapend` is getting called to cancel the tap action when mouse is leaving the button.

### Removed touch/click `preventDefault` fix

[WuiDom](https://github.com/Wizcorp/wui-Dom/releases/tag/0.3.3) was refactored and incorporates this fix.
This made a lot more sense as all behaviors would need this.
It didn't make sense to have to replicate this every time we created a new behavior.
As such this version of wui-buttonBehavior requires WuiDom v0.4.0 and above.


## v0.1.0

First version