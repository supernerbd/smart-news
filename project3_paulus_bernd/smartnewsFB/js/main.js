/*
main.js
*/
"use strict";

//fb List from: http://stackoverflow.com/questions/4216648/facebook-pages-authoritative-list-of-categories
// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.main= (function(){
	//vars
	var content;
	var storage;
	var fbData;
	var category;
	var guardian;
	var store = true;
	var wasHere;
	
	function init(){ //Init rest of app. Is called by social.fbGetDataCallback() to make sure facebook data is loaded.
		//init modules
		content = app.content;
		storage = app.storage;
		wasHere = storage.init();
		//check if user wants to use local storage
		if(wasHere){
			var read = storage.read();
			if(read === false){
				store = false;
				document.querySelector("#store").checked = false;
				$(".minus").fadeOut();
				$(".plus").fadeOut();
			}
		}
		//get facebook infos
		fbData= app.social.fbData;
		//determine content for sections
		categoryCount();
		// UI
		document.querySelector("#store").onchange = function(e){
			if(e.target.checked){ 
				store=true;
				storage.write(true);
				//document.location.reload();
			}
			else{ 
				store=false; 
				storage.write(false);
				$(".minus").fadeOut();
				$(".plus").fadeOut();
			}
		};
	};
	
	function categoryCount(){ //take list of likes and list of guardian categories and count which likes correspond with which category.
		//load the two json objs. 
		if(!guardian){
			$.getJSON("json/guardian.json", function(data){
				guardian = data;
				categoryCount();
			});
			return;
		}
		if(!category){
			//get category json
			$.getJSON("json/fbCategories.json", function(data){
				category = data;
				categoryCount();
			});
			return;
		}
		//seal objects. Without try/catch wouldn't work and the guardian obj would propably have several "undefinded": NaN in it. 
		Object.seal(guardian);
		Object.seal(category);
		//count which likes correspond with which category
		//category is an obj with hard coded relationships between like-categories and guardian-categories
		//guardian is an obj with all guardian-categories and a number. When a like-category has a corresponding guardian-category this guardian-categories count goes up.
		for (var i=0; i<fbData.likeCategories.length; i++){
			try {
				var first = category[fbData.likeCategories[i]];
				guardian[first]++;
			} 
			catch (e) {
			//	console.log("unknown category " + category[fbData.likeCategories[i]]);
			}
		}
		//set categories
		setCategories(guardian);
	};
	
	function setCategories(guardian){
		//vars
		var location1;
		var location2;
		var interest1;
		var interest2;
		var interest3;
		var guardianSorted = [];
		//locations
		if(fbData.locationCountry == fbData.homeCountry){
			location1 = fbData.locationCountry;
		}
		else{
			location1 = fbData.locationCountry;
			location2 = fbData.homeCountry;
		}
		//interests
		//set guardian list as counter in local storage if it's the first time visiting the site
		if(!wasHere && store){
			storage.write(guardian);
		}
		else{
			//load local Storage numbers, add old numbers to new and divide by 2. Downgraded and last shown items are now lower numbers
			var oldGuardian = storage.read();
			for (var prop in oldGuardian){
				for(var prop2 in guardian){
					if(prop==prop2){
						guardian[prop2] += oldGuardian[prop];
						guardian[prop2] = guardian[prop2]/2;
					}
				}
			}
		}
		//bring obj in ordered array: With help from here: http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
		for (var property in guardian){
			if(property == "none"){
				//do nothing, don't want to use "none".
			}
			else{
				guardianSorted.push([property, guardian[property]])
			}
		}
		guardianSorted.sort(function(a, b) {return a[1] - b[1]});
		// set interests
		interest1 = guardianSorted[guardianSorted.length-1][0];
		interest2 = guardianSorted[guardianSorted.length-2][0];
		interest3 = guardianSorted[guardianSorted.length-3][0];
		
		//get Content
		if(!location2){
			content.getGuardian({section: "#d1", number: 7, location: location1});
			content.getGuardian({section: "#d2", number: 3, interest: interest1});
			content.getGuardian({section: "#d3", number: 3, interest: interest2});
			content.getGuardian({section: "ticker", number: 5, interest: interest3});
		}
		else{
			content.getGuardian({section: "#d1", number: 7, location: location1});
			content.getGuardian({section: "#d2", number: 3, interest: interest1});
			content.getGuardian({section: "#d3", number: 3, interest: interest2});
			content.getGuardian({section: "ticker", number: 5, location: location2});
		}
		//hide loading screen
		$("#loading").fadeOut();
		// determine new numbers for local storage
		if(store){
			for(var prop in guardian){
				if(prop==interest1){
					guardian[prop] = guardian[prop]/4;
				}
				if(prop==interest2){
					guardian[prop] = guardian[prop]/4;
				}
				if(prop==interest3){
					guardian[prop] = guardian[prop]/4;
				}
			}
		}
		// write new numbers in local Storage
		if(store){
			storage.write(guardian);
		}
		//$( "#progressbar" ).progressbar( "destroy" );
	};
	
	function minus(string){ //downgrade category
		var obj = storage.read();
		obj[string] -= 50;
		storage.write(obj);
		//document.location.reload();
	};
	
	function plus(string){ //upgrade category
		var obj = storage.read();
		obj[string] += 10;
		storage.write(obj);
	};


	return{
		init: init,
		minus: minus,
		plus: plus
	}
}());
