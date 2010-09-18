<%
'=======================================================================
' default.asp
' jpl 06/02/10
'	
'	Demo page for PowerMeter
'
'	
'=======================================================================
	
	Call DisplayPage()
	Response.End


Function DisplayPage()
	
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <link rel="SHORTCUT ICON" HREF="images/favicon.ico" type="image/ico">
  <title>MooTools PowerMeter Demo</title>
  <meta name="description" content="">
  <meta name="keywords" content="">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <link href="css/public.css" media="screen" rel="Stylesheet" type="text/css" />
  <!--[if IE]>
    <style>* html .verticalHolder { margin-right: 11px; }</style>
  <![endif]-->
  <script type="text/javascript" src="scripts/mootools-1.2.4-core.js"></script>
  <script type="text/javascript" src="scripts/PowerMeter.js"></script>
  <script type="text/javascript" src="scripts/PowerMeter.Control.js"></script>
<script type="text/javascript">
window.addEvent('domready', function() {
	App = {};
	App.meters = [];
	App.verticalMeters = [];
	App.totalCapacity = 200;
	
	App.totalMeter = new PowerMeter('totalPowerMeter', 0, App.totalCapacity, {
		currentValueLabel:	'totalMessage'
	});
});
	
	function updateTotalBar() {
		var total = 0;
		App.meters.each(function(meter) {
			total += meter.currentValue;
		});
		App.totalMeter.updateValue(total);
		var totalBalance = App.totalCapacity - total;
		
		// now update the max values in each meter to prevent overflow:
		App.meters.each(function(meter) {
			if(meter.currentValue > 0) {
				var thisBalance = (meter.fullValue - meter.currentValue);
				meter.setMax((meter.currentValue + totalBalance).limit(0, meter.fullValue), true);
			}
		});
	}
</script>
</head>
<body>
  <h2>Power Meter Demo</h2>
  <p style="width: 450px; margin: 0 auto 20px auto;">
    Widget for displaying and interacting with bar-style meters.
  </p>
  <p style="width: 450px; margin: 0 auto 20px auto;">With the exception of the
    Total meter, these are of the
    extended PowerMeter.Control class, meaning you can control their value with mouse clicks
    and drags.  The Total meter updates itself based on the values of Item 1, 2 and 3.
  </p>
<div class="mainWindow">
  <div class="viewPort" id="viewPort">
    <div class="page"><div class="inner">
<%
	Dim iCount
	for iCount = 0 to 2
%>
      <div class="item">
        Item <%=iCount+1%>:
        <div id="message<%=iCount%>" class="message"></div>
        <div id="powerMeter<%=iCount%>" class="powerMeter"></div>
      </div>
<script type="text/javascript">
window.addEvent('domready', function() {
	App.meters[<%=iCount%>] = new PowerMeter.Control('powerMeter<%=iCount%>', 0, 100, {
		currentValueLabel:	'message<%=iCount%>',
		valueLabel:			'[value] units',
		emptyValueLabel:	'',
		singleValueLabel:	'[value] unit',
		onChange:			updateTotalBar
	});
});
</script>
<%	
	next
%>
      <div class="item">
        Total:
        <div class="bold message"><span id="totalMessage"></span> / 200 units</div>
        <div id="totalPowerMeter" class="powerMeter" style="height: 40px;"></div>
      </div>
      <div class="clear"></div>
      <br /><br />
      Vertical Meters:<br />

<%
	for vCount = 1 to 5
%>
      <div class="left verticalHolder">
        <div id="powerMeterV<%=vCount%>" class="powerMeter vertical"></div>
      </div>
<script type="text/javascript">
window.addEvent('domready', function() {
	App.verticalMeters[<%=vCount%>] = new PowerMeter.Control('powerMeterV<%=vCount%>', 0, 100, {
		mode:				'bottom-to-top'
	});
});
</script>
<%	
	next
%>
      <div class="clear"></div>
    </div></div>
  </div><!--viewPort-->
</div><!--mainWindow-->
</body>
</html>
<%
End Function
%>