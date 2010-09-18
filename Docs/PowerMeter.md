PowerMeter
==========

PowerMeter is a visual widget for displaying a given relative to a max value.  (Think the energy bar in Street Fighter or Mortal Kombat.)

PowerMeter.Control turns this visual display into an UI widget that allows the user to set a value with a click or a drag.

How to Use
----------

PowerMeter operates on a single HTML element (most typically a div) and renders a bar of power within it:

<div id="myMeter" class="powerMeter"></div>

In our CSS we should style the meter to our liking.  Here CSS3 gradients and rounded corners provide for some really nice effects:

.powerMeter {
	height:			20px;
	width:			320px;
	padding:			1px;
	background:			#000;
	border-radius:		6px;
}
.powerMeter .power {
	height:			100%;
	background:			-moz-linear-gradient(top, #FDFF1F, #FEFF6F 30%, #fff 40%, #CECF33);
	border-radius:			6px 0 0 6px;
}
.powerMeter .power.full {
	border-radius:		6px;
}

Say then that we want the myMeter div to be a power meter with a max value of 100 and a current value of 70.  Our JavaScript would be:

new PowerMeter("myMeter", 70, 100);

To turn our div into a functioning meter that allows user manipulation, we do:

new PowerMeter.Control("myMeter", 70, 100);


PowerMeter supports numeric labels that reflect the current value of the meter.  This is realized by passing another HTML element as the currentValueLabel option, and optionally various label parameters describing how the value label should be formated based on the value itself:
	
<div id="myMeter" class="powerMeter"></div>
<span id="myLabel"></span>

new PowerMeter("myMeter", 70, 100, {
	currentValueLabel: 'myLabel',
	valueLabel: '[value] units',
	emptyValueLabel:	'',  // don't show a label at all if empty
	singleValueLabel:	'[value] unit',  // singular form of the noun when value = 1
	fullValueLabel: '-Max units-'
});


PowerMeter Options
------------------

In addition to the option parameters concerning value labels described above, PowerMeter supports several other options:

- mode describes the direction in which the sliver of power is supposed to grow from zero to full.  Supported values are 'right-to-left', 'top-to-bottom', and 'bottom-to-top'.
- emptyValue allows you do provide an alternate numeric value which corresponds to the meter appearing completely empty (this of course defaults to zero).
- onChange is a callback handler.
- Several others which control the finer grain details of the display include powerBarClass, fullPowerBarClass and sliverPowerWidth.

Screenshots
-----------

![Screenshot](http://www.jpl-consulting.com/projects/MooTools/PowerMeter/ScreenShots/PowerMeter1.gif)
![Screenshot](http://www.jpl-consulting.com/projects/MooTools/PowerMeter/ScreenShots/PowerMeter2.gif)