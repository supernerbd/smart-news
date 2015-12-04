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
	var category;
	var guardian;
	
	function init(){ //Init rest of app. Is called by social.fbGetDataCallback() to make sure facebook data is loaded.
		console.log("site");
		//init modules
		content = app.content;
		
		//get facebook infos
		fbData= app.social.fbData;
		console.log(fbData);
		//determine content for sections
		categoryCount();
		//get Content
		content.getGuardian({section: "#d1", number: 7, location: "world"});
		content.getGuardian({section: "#d2", number: 3, location: "germany"});
		content.getGuardian({section: "#d3", number: 3, interest: "sport"});
		content.getGuardian({section: "ticker", number: 5, interest: "football"});
		//hide loading screen
		$("#loading").fadeOut();
	};
	
	//load the two json objs. Than run code..
	function categoryCount(){
		if(!guardian){
			$.getJSON("json/guardian.json", function(data){
				guardian = data;
				categoryCount();
			});
			return;
		}
		if(!category){
			$.getJSON("json/fbCategories.json", function(data){
				category = data;
				categoryCount();
			});
			return;
		}
		Object.seal(guardian);
		Object.seal(category);
		for (var i=0; i<fbData.likeCategories.length; i++){
			try {
				var first = category[fbData.likeCategories[i]];
				guardian[first]++;
			} catch (e) {
				console.log("unknown category " + category[fbData.likeCategories[i]]);
			}
		}
		console.log(guardian);
	};

	return{
		init: init
	}
}());
