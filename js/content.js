/*
content.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.content= (function(){
	//vars
	var section;
	
	//get Content from the Guardian. 
	/*
	obj needs:
	.section -> used to write the content on the right section on the site.
	obj can have:
	.location (land or world)
	.edition (uk/us/au)
	.interest (...)
	.number (of articles to output)
	*/
	function getGuardian(obj){
		//vars
		var url = "http://content.guardianapis.com/";
		var fields = "&show-fields=byline,trailText";
		var key = "?api-key=czwd98htekjvaagsapfur98h";
		var size = "&page-size=";
		//set section
		section = obj.section;
		//Build URL with obj
		
		if(obj.location){
			if(obj.edition){
				url += obj.edition;
				url += "/";
			}
			if(obj-location=="world"){
				url += obj.location;
			}
			else{
				url += "world/";
				url += obj.location;
			}
			url += key;
			url += fields;
			url += size;
			url += obj.number;
		}
		
		if(obj.interest){
			if(obj.edition){
				url += obj.edition;
				url += "/";
			}
			url += obj.interest;
			url += key;
			url += fields;
			url += size;
			url += obj.number;
		}
		
		//make request
		$.ajax({
		  dataType: "jsonp",
		  url: url,
		  data: null,
		  success: receive
		});
	};
	
	function receive(obj){
		console.log("obj stringified = " + JSON.stringify(obj));
	};
	
	//Functions to public
	return{
		getGuardian: getGuardian
	}

}());