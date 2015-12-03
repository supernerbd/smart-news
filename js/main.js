/*
main.js
*/
"use strict";

//TODO: 

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.main= (function(){
	//vars
	var content;
	
	
	function init(){ //Init app
	console.log("site");
	//init modules
	content = app.content;
	
	//get facebook infos
	
	//determine content for sections
	
	//get Content
	content.getGuardian({section: "#d1", number: 7, location: "world"});
	content.getGuardian({section: "#d2", number: 3, location: "germany"});
	content.getGuardian({section: "#d3", number: 3, interest: "sport"});
	content.getGuardian({section: "ticker", number: 5, interest: "football"});
	//hide loading screen
	$("#loading").fadeOut();
	};
	

	return{
		init: init
	}
}());
