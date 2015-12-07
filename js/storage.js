/*
storage.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.storage= (function(){
	//vars
	var wasHere;
	//helper. Found here: http://stackoverflow.com/questions/3357553/how-to-store-an-array-in-localstorage
	//this way i can store objects/arrays in local storage, very neat!
	Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
	}
	Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
	}
	
	function init(){ //returns if player had opened this site before
		if(window.localStorage.getObj("bmp7101-newsApp")==undefined || window.localStorage.getObj("bmp7101-newsApp")==true){ 
			wasHere=false;
			window.localStorage.setObj("bmp7101-newsApp", "yes");
		}
		else{
			wasHere=true;
		}
		return wasHere;
	};
	
	function write(obj){ //writes obj to local storage
		window.localStorage.setObj("bmp7101-newsApp", obj);
	};
	
	function read(){ //reads object from local torage
		return window.localStorage.getObj("bmp7101-newsApp");
	};
	
	//public interface
	return{
		init: init,
		wasHere: wasHere,
		read: read,
		write: write
	}
	
}());