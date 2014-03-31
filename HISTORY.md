# Release history

## vCurrent

### Removed touch/click `preventDefault` fix

WuiDom was refactored and incorporates this fix. This made a lot more sense as all behaviors would
need this. It didn't make sense to have to replicate this every time we created a new behavior. As
such this version of wui-buttonBehavior requires WuiDom v0.4.0 and above.

## v0.1.0

First version