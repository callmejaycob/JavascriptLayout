/*! PLayout div layout system 
 */

$(document).ready(function() {
	//run the layout mechanism, if it fails, then don't bother setting the window size listener...	
	do_playoutScreenFunction();
	$(window).resize(function() {
    	do_playoutScreenFunction();
    });
});

var playoutClasses = ['playoutborder', 'playoutrows', 'playoutcolumns', 'playoutaware'];

function do_playoutScreenFunction() {	
	var rootDivs = [];
	for(var i=0;i<document.body.children.length;i++) {
		var nextChild = document.body.children[i];
		if (nextChild.tagName==="DIV") {		
			var found = 0;
			for (var ec in playoutClasses) {
				var eachClass = playoutClasses[ec];			
				if ($(nextChild).hasClass(eachClass)) {					
					if (found==0) rootDivs.push(nextChild);
					found = 1;
				}	
			}
		}
	}
	
	if (rootDivs.length!=1) {
		throw "There can be only one Playout div at the root of the document, found "+rootDivs.length;
	}
	
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	width = width - 1;
	height = height - 1;

	do_playoutOnDiv(rootDivs[0], 0, 0, width, height);
}

function do_playoutOnDiv(thisDiv, xpos, ypos, width, height) {
	//get the outer border size of the div...
	
	var $thisDiv = $(thisDiv);
	var borderWidth = $thisDiv.css('border-left-width') + $thisDiv.css('border-right-width');
	var borderHeight = $thisDiv.css('padding-top') + $thisDiv.css('padding-bottom');
	$thisDiv.css("position", "absolute");
	
	var leftPad = 0;
	var rightPad = 0;
	var topPad = 0;
	var bottomPad = 0;
	
	//data-padleft
	if (thisDiv.dataset.padleft!=null) {
		leftPad = +thisDiv.dataset.padleft;
	}
	if (thisDiv.dataset.padright!=null) {
		rightPad = +thisDiv.dataset.padright;
	}
	if (thisDiv.dataset.padtop!=null) {
		topPad = +thisDiv.dataset.padtop;
	}
	if (thisDiv.dataset.padbottom!=null) {
		bottomPad = +thisDiv.dataset.padbottom;
	}
	
	xpos = +xpos + leftPad;
	ypos = +ypos + topPad;
	width = +width - (leftPad + rightPad);
	height = +height - (topPad + bottomPad);
	
	$thisDiv.width(width);
	$thisDiv.height(height);
	$thisDiv.css('top', ypos);
	$thisDiv.css('left', xpos);
	
	var divWidth = $thisDiv.innerWidth();
	var divHeight = $thisDiv.innerHeight();
		
	//delegate based on layout type...
	if ($thisDiv.hasClass('playoutborder')) {
		do_playoutBorderLayout(thisDiv, width, height);
		performAwareFunction(thisDiv, width, height);
	} else if ($thisDiv.hasClass('playoutrows')) {
		do_playoutRowLayout(thisDiv, width, height);
		performAwareFunction(thisDiv, width, height);
	} else if ($thisDiv.hasClass('playoutcolumns')) {
		do_playoutColumnLayout(thisDiv, width, height);
		performAwareFunction(thisDiv, width, height);
	} else {
		performAwareFunction(thisDiv, width, height);		
	}
}

function performAwareFunction(thisDiv, width, height) {
	var awareFunction = thisDiv.playoutOccurred;
	if (awareFunction!=undefined) {
		awareFunction(width, height);
	}	
}


function do_playoutRowLayout(thisDiv, width, height) {
	//locate all divs that can be layed out...	
	var childDivs = [];
	for(var i=0;i<thisDiv.children.length;i++) {		
		var nextChild = thisDiv.children[i];
		if (nextChild.tagName==="DIV") {					
			var found = 0;
			for (var ec in playoutClasses) {
				var eachClass = playoutClasses[ec];							
				if ($(nextChild).hasClass(eachClass)) {					
					if (found==0)childDivs.push(nextChild);				
					found = 1;
				}	
			}
		}
	}	
	
	var heightPerDiv = height/childDivs.length;	
	var by = 0;
	for (var nc in childDivs) {
		var nextChild = childDivs[nc];
		do_playoutOnDiv(nextChild, 0, by, width, heightPerDiv);
		by = by + heightPerDiv;
	}
	
}


function do_playoutColumnLayout(thisDiv, width, height) {
	//locate all divs that can be layed out...
	
	var childDivs = [];
	for (var nc in thisDiv.children) {
		var nextChild = thisDiv.children[nc];
		if (nextChild.tagName==="DIV") {	
			var found = 0;
			for (var ec in playoutClasses) {
				var eachClass = playoutClasses[ec];			
				if ($(nextChild).hasClass(eachClass)) {					
					if (found==0)childDivs.push(nextChild);
					found = 1;
				}	
			}
		}
	}
	var widthPerDiv = width/childDivs.length;
	var bx = 0;
	for (var nc in childDivs) {
		var nextChild = childDivs[nc];
		do_playoutOnDiv(nextChild, bx, 0, widthPerDiv, height);
		bx = bx + widthPerDiv;
	}
	
}


function do_playoutBorderLayout(thisDiv, width, height) {
	//locate each of the five possible layout types...
	var north = locateDiv(thisDiv, 'playoutnorth');
	var south = locateDiv(thisDiv, 'playoutsouth');
	var east = locateDiv(thisDiv, 'playouteast');
	var west = locateDiv(thisDiv, 'playoutwest');
	var center = locateDiv(thisDiv, 'playoutcenter');
	
	var northOffset = 0;
	if (north!=null) {		
		northOffset = getDesiredDivHeight(north, height);
	}
	var southOffset = 0;
	if (south!=undefined) {
		southOffset = getDesiredDivHeight(south, height);
	}
	var eastOffset = 0;
	if (east!=undefined) {
		eastOffset = getDesiredDivWidth(east, width);
	}
	var westOffset = 0;
	if (west!=null) {
		westOffset = getDesiredDivWidth(west, width);
	}
	
	if (northOffset>height) {
		northOffset = height;
	}
	if (southOffset + northOffset > height) {
		southOffset = height - northOffset;
	}
	if (westOffset > width) {
		westOffset = width;
	}
	if (eastOffset + westOffset > width) {
		eastOffset = width - westOffset;
	}
	
	if (center!=null) {
		var centerHeight = height - northOffset - southOffset;
		var centerWidth = width - eastOffset - westOffset;
		var centerX = westOffset;
		var centerY = northOffset;
		do_playoutOnDiv(center, centerX, centerY, centerWidth, centerHeight);
	}
	if (north!=null) {
		do_playoutOnDiv(north, 0, 0, width, northOffset);
	}
	if (south!=null) {
		do_playoutOnDiv(south, 0, height-southOffset, width, southOffset);
	}
	if (west!=null) {
		do_playoutOnDiv(west, 0, northOffset, westOffset, height-northOffset-southOffset);
	}
	if (east!=null) {
		do_playoutOnDiv(east, width-eastOffset, northOffset, eastOffset, height-northOffset-southOffset);
	}
	
	
}

//calculates the desired height based on the playout-height property...
function getDesiredDivHeight(thisDiv, parentHeight) {	
	if (thisDiv.dataset.playoutheight==null) {
		throw "Missing data-playoutheight param in DIV";
	}
	return getDesiredDimension(thisDiv.dataset.playoutheight, parentHeight);
}

function getDesiredDivWidth(thisDiv, parentWidth) {
	if (thisDiv.dataset.playoutwidth==null) {
		throw "Missing data-playoutwidth param in DIV";
	}
	return getDesiredDimension(thisDiv.dataset.playoutwidth, parentWidth);
}

function getDesiredDimension(requested, total) {
	if (endsWith(requested, "%")) {
		var size = parseInt(requested, 10);
		size = size / 100;
		return total * size;
	} else if (endsWith(requested, "px")) {
		return parseInt(requested, 10);
	} else {
		return parseInt(requested, 10);
	}
}

function endsWith(stringInput, what) {
	var position = stringInput.length - 1;
    var lastIndex = stringInput.indexOf(what, position);
    return lastIndex !== -1 && lastIndex === position;
}

function locateDiv(thisDiv, classToLocate) {
	var divCount = 0;
	var returnDiv = null;
	for (var nc in thisDiv.children) {
		var nextChild = thisDiv.children[nc];
		if (nextChild.tagName==="DIV") {					
			if ($(nextChild).hasClass(classToLocate)) {
				divCount++;
				returnDiv = nextChild;
			}
		}
	}
	if (divCount>1) {
		throw "Should only be single div with class "+classToLocate;
	}
	return returnDiv;
}
