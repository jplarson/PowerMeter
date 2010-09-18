/*
---
description: UI widget for rendering animated bar-style meters.

license: MIT-style

authors:
- John Larson

requires:
- core:1.2.4/Events
- core:1.2.4/Options
- core:1.2.4/Element.Event
- core:1.2.4/Element.Style
- core:1.2.4/Element.Dimensions

provides: [PowerMeter]

...
*/

var PowerMeter = new Class({
	
	Implements: [Options, Events],
	
	options: {
		onChange:				$empty,
		mode:					'left-to-right', // accepts 'right-to-left', 'top-to-bottom', 'bottom-to-top'
		emptyValue:				0,
		powerBarClass:			'power',
		fullPowerBarClass:		'full',
		currentValueLabel:		null,
		valueLabel:				'[value]',
		emptyValueLabel:		null,
		fullValueLabel:			null,
		singleValueLabel:		null,
		sliverPowerWidth:		3
	},
	
	initialize: function(element, currentValue, fullValue, options) {
		if(!$(element)) {
			throw('Unknown element passed to PowerMeter contructor (' + element + ')');
		}
		
		this.element		= $(element);
		this.currentValue	= currentValue;
		this.fullValue		= fullValue;
		this.setOptions(options);
		
		
		switch (this.options.mode){
			case 'right-to-left':
				this.axis = 'x'; this.property = 'width';  this.inverted = true;  break;
			case 'top-to-bottom':
				this.axis = 'y'; this.property = 'height'; this.inverted = false; break;
			case 'bottom-to-top':
				this.axis = 'y'; this.property = 'height'; this.inverted = true;  break;
			default: // left to right
				this.axis = 'x'; this.property = 'width';  this.inverted = false; break;
		}
		
		if(this.element.getStyle('display') == 'inline') {
			if(Browser.Engine.trident)
				this.element.setStyle('zoom', 1);
			else
				this.element.setStyle('display', 'inline-block');
		}
		
		this.powerBar = new Element('div', { 'class': this.options.powerBarClass });
		this.element.empty();
		this.element.adopt(this.powerBar);
		this.fullSize = this.element.getStyle(this.property).toInt();
		
		if(Browser.Engine.trident) {
			var i = (this.axis == 'y' ? 0 : 1);
			var borders = this.element.getStyle('border-width').split(' ');
			var paddings = this.element.getStyle('padding').split(' ');
			this.fullSize -= (borders[i].toInt() + borders[i+2].toInt() + paddings[i].toInt() + paddings[i+2].toInt());
		}
		
		if($type(currentValue) == 'element') {
			this.currentValue = properInt(currentValue.get('text'), 0);
			this.currentValueLabel = currentValue;
		}
		else if($(this.options.currentValueLabel))
			this.currentValueLabel = $(this.options.currentValueLabel);
		
		this.powerBar.setStyle(this.property, 0);
		this.setValueLabel();
		this.animatePowerBar();
		return;
	},
	
	
	updateValue: function(newValue) {
		this.currentValue = newValue.toFloat();
		this.setValueLabel();
		this.animatePowerBar();
		this.fireEvent('change', newValue);
	},
	
	setValueLabel: function() {
		if(this.currentValueLabel)
			this.currentValueLabel.set('text', this.prepareLabel(this.currentValue));
	},
	
	prepareLabel: function(value) {
		var label;
		if(value <= this.options.emptyValue  &&  $defined(this.options.emptyValueLabel))
			label = this.options.emptyValueLabel;
		else if(value >= this.options.fullValue   &&  $defined(this.options.fullValueLabel))
			label = this.options.fullValueLabel;
		else if(value == 1  &&  $defined(this.options.singleValueLabel))
			label = this.options.singleValueLabel
		else
			label = this.options.valueLabel;
		
		return label.replace('[value]', value);
	},
	
	animatePowerBar: function() {
		var powerSize;
		if(this.fullValue == this.options.emptyValue)
			powerSize = 0;
		else
			powerSize = Math.min(Math.floor(this.fullSize * (this.currentValue - this.options.emptyValue) / this.fullValue), this.fullSize)
		
		if(powerSize < this.options.sliverPowerWidth  &&  this.currentValue > this.options.emptyValue)
			powerSize = this.options.sliverPowerWidth; // we'll show a sliver for non-empty power
		
		if(this.currentValue >= this.fullValue)
			this.powerBar.addClass(this.options.fullPowerBarClass);
		else
			this.powerBar.removeClass(this.options.fullPowerBarClass);
		
		this.powerBar.tween(this.property, Math.max(0, powerSize));
	},
	
	tween: function(newSize) {
		var newPowerSize = this.powerBar.getSize()[this.axis] * (newSize / this.fullSize);
		this.fullSize = newSize;
		this.element.tween(this.property, newSize);
		this.powerBar.tween(this.property, newPowerSize);
	}
});