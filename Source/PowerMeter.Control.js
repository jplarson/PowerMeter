/*
---
description: Extension to PowerMeter that offers click and drag control of the meter value.

license: MIT-style

authors:
- John Larson

requires:
- PowerMeter

provides: [PowerMeter.Control]

...
*/

PowerMeter.Control = new Class({

	Extends: PowerMeter,
	
	Binds: ['onMouseDown',  'onMouseMove', 'onMouseUp', 'onClick'],

	options: {
		minValue:		0,
		maxValue:		null
	},

	initialize: function(element, currentValue, fullValue, options) {
		
		this.parent(element, currentValue, fullValue, options);
		
		if(!$chk(this.options.maxValue))
			this.options.maxValue = fullValue;
		
		
		this.document = this.element.getDocument();
		
		this.attach();
	},
	
	setMax: function(newMax, updateIfTooHigh) {
		this.options.maxValue = newMax;
		if(updateIfTooHigh  &&  this.currentValue > newMax)
			this.updateValue(newMax);
	},
	
	setMin: function(newMin, updateIfTooLow) {
		this.options.minValue = newMin;
		if(updateIfTooLow  &&  this.currentValue < newMin)
			this.updateValue(newMin);
	},

	attach: function() {
		this.element.addEvents({
			'mousedown':	this.onMouseDown.bind(this),
			'mousemove':	this.onMouseMove.bind(this),
			'mouseup':		this.onMouseUp.bind(this),
			'click':		this.onClick.bind(this)
		});
		
		this.document.addEvent('mouseup', this.onMouseUp.bind(this));
		return this;
	},

	detach: function() {
		this.element.removeEvent('onClick', this.onClick);
		this.element.removeEvent('mousedown', this.onMouseDown);
		this.element.removeEvent('mousemove', this.onMouseMove);
		this.element.removeEvent('mouseup', this.onMouseUp);
		return this;
	},
	
	onMouseDown: function(event) {
		this.isDragging = true;
		this.preDragValue = this.currentValue;
		event.stop();
	},
	onMouseMove: function(event) {
		if(!this.isDragging) return;
		
		var position = this.getMouseEventPosition(event);
	
		this.powerBar.setStyle(this.property, position);
		
		// now to map the position back to an integer value of the bar:
		var newValue = this.options.emptyValue + this.fullValue * (position/this.fullSize);
		
		this.currentValue = Math.round(newValue);
		this.setValueLabel();
		
		this.isDragged = true;
		event.stop();
	},
	onMouseUp: function(event) {
		if(!this.isDragged) return;
		
		var position = this.getMouseEventPosition(event);
		this.isDragging = false;
		
		// now to map the position back to an integer value of the bar:
		var newValue = this.options.emptyValue + this.fullValue * (position/this.fullSize);
		
		if(Math.round(newValue) == this.preDragValue) { // close, let's make some action:
			if(newValue > this.preDragValue)
				newValue = Math.ceil(newValue);
			else
				newValue = Math.floor(newValue);
		}
		else
			newValue = Math.round(newValue);
		
		this.updateValue(newValue.limit(this.options.minValue, this.options.maxValue));
		
		(function() { this.isDragged = false}).delay(100, this);
		
		event.stop();
	},
	
	onClick: function(event) {
		
		if(this.isDragged)
			return;
		
		this.isDragging = false;
		this.isDragged = false;
		var position = this.getMouseEventPosition(event);
		
		position = position.limit(0, this.fullSize);
		
		// now to map the position back to an integer value of the bar:
		var newValue = this.options.emptyValue + this.fullValue * (position/this.fullSize);
		
		if(Math.round(newValue) == this.currentValue) {
			if(newValue > this.currentValue)
				newValue = Math.ceil(newValue);
			if(newValue < this.currentValue)
				newValue = Math.floor(newValue);
		}
		else
			newValue = Math.round(newValue);
		
		this.updateValue(newValue.limit(this.options.minValue, this.options.maxValue));
		event.stop();
	},

	getMouseEventPosition: function(event) {
		var position = event.page[this.axis] - this.element.getPosition()[this.axis];
		if(this.inverted)
			position = this.fullSize - position;
		return this.getLimitedPosition(position);
	},
	
	getLimitedPosition: function(position) {
		var minPosition = (this.options.minValue - this.options.emptyValue) * this.fullSize / this.fullValue;
		var maxPosition = (this.options.maxValue - this.options.emptyValue) * this.fullSize / this.fullValue;
		return position.limit(minPosition, maxPosition);
	}
});