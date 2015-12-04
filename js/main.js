/*
main.js
*/
"use strict";

//TODO: 
//fb List from: http://stackoverflow.com/questions/4216648/facebook-pages-authoritative-list-of-categories
// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.main= (function(){
	//vars
	var content;
	var fbData;
	
	function init(){ //Init rest of app. Is called by social.fbGetDataCallback() to make sure facebook data is loaded.
		console.log("site");
		//init modules
		content = app.content;
		
		//get facebook infos
		fbData= app.social.fbData;
		console.log(fbData);
		//determine content for sections
		test(fbData);
		//get Content
		content.getGuardian({section: "#d1", number: 7, location: "world"});
		content.getGuardian({section: "#d2", number: 3, location: "germany"});
		content.getGuardian({section: "#d3", number: 3, interest: "sport"});
		content.getGuardian({section: "ticker", number: 5, interest: "football"});
		//hide loading screen
		$("#loading").fadeOut();
	};
	
	function test(data){
		var cat={
			"Media/News/Publishing": "media",
			"Education": "education",
			"Musician/Band": "music"
		};
		Object.seal(cat);
		console.log(cat);
		var guardian={};
		guardian.media = 0;
		guardian.education = 0;
		guardian.music = 0;
		Object.seal(guardian);
		console.log(guardian);
		for (var i=0; i<data.likeCategories.length; i++){
			try {
				var first = cat[data.likeCategories[i]];
				guardian[first]++;
			} catch (e) {
				console.log("unknown category");
			}
		}
		console.log(guardian);
	};

	return{
		init: init
	}
}());
