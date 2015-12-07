/*
social.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.social= (function(){
	//vars
	var canvas = false;
	var fbData = {};
	var permissions = 'public_profile,user_hometown,user_likes,user_location';
	//INIT:
	function init(){
		//determine if in browser or facebook canvas
		//The login to facebook is slightly different between the facebook canvas and a normal website. Facebook canvas is an iframe, so I check if the app is run in an iframe.
		if(inIframe()){
			canvas=true;
		}
		//connect to facebook api
		$.getScript('//connect.facebook.net/en_US/sdk.js', function(){
			FB.init({
				appId: '1676537059257348',
				version: 'v2.5',
				xfbml: false,
				status: true
		});     
		//login to facebook/ get user permission
		fbLogin();
		});
		
		
	};
	
	//FB LOGIN
	//handles login to facebook and user permissions
	function fbLogin(){
		FB.getLoginStatus(function(data){fbLoginCallback(data)});
	};
	
	//handles callbacks from fbLogin()
	function fbLoginCallback(data){
		if(data.status === "connected"){ //User is connected to facebook and app -> get Data
			fbGetData();
		}
		else{ //user is not connected to facebook (status="unknown") or not connected to the app (status="not_authorized") -> start fb login dialog
			//if canvas -> ask for permissions
			if (canvas){
				FB.login(function(data){
					if(data.status === "connected"){ //if permission is granted recall this function, else go to facebook.com
						fbLoginCallback(data);
					}
					else{
						top.location.href = "https://www.facebook.com/";//appcenter/YOUR_APP_NAMESPACE";
					}
				}, //permissions asked
				{scope: permissions}
				);
			}
			// else show welcome screen with custom login button (This way the pop-up isn't blocked by the browser)
			document.querySelector("#welcome").style.height=window.innerHeight+"px";
			document.querySelector("#welcome").style.width=window.innerWidth+"px";
			document.querySelector("#welcome").style.display="inherit";
		}
	};
	
	//onclick event of button to start login dialog
	function fbLoginButton(){
		document.querySelector("#welcome").querySelector("p").innerHTML="Please use the facebook dialog window."; //change welcome screen text
		FB.login(function(data){
			if(data.status === "connected"){ //if permission is granted call fbLoginCallback, else ask again
				document.querySelector("#welcome").style.display="none";
				fbLoginCallback(data);
			}
			else{ //change welcome screen text
				document.querySelector("#welcome").querySelector("p").innerHTML="Sorry! Without your facebook data the app can not be used. You can invoke the dialog again on the button.";
				document.querySelector("#welcome").style.display="inherit";
			}
		}, //permissions asked
		{scope: permissions}
		);
	};
	//FB DATA:
	//get Data from graph api (user endpoint: https://developers.facebook.com/docs/graph-api/reference/user)
	//location, hometown, likes
	function fbGetData(){
		//ask for hometown, location and likes
		FB.api('/me?fields=hometown{location},location{location},likes.limit(1000){category}', fbGetDataCallback);
	};
	
	function fbGetDataCallback(data){
		//receive data, write hometown and location in fbData Obj, count like categorys and write categories in obj
		
		//build fb data obj
		fbData.likeCategories = [];
		
		if(data.hometown.location.country){
			fbData.homeCountry = data.hometown.location.country;
		}
		else{ //set it to world when not existent
			fbData.homeCountry = "world";
		}
		if(data.location.location.country){
			fbData.locationCountry = data.location.location.country;
		}
		else{ //set it to world when not existent
			fbData.locationCountry = "world";
		}

		//build likeCategories Array
		for (var i=0; i<data.likes.data.length; i++){
			fbData.likeCategories[i] = data.likes.data[i].category;
		}
		
		app.main.init(); //make sure that facebook data is loaded before calling the rest of the app.
		return fbData;
	};
	
	//HELPER
	//find out if app is run in an iframe
	//function found here: http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
	function inIframe () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	};
	
	//public interface
	return{
		init: init,
		fbLoginButton: fbLoginButton,
		fbGetData: fbGetData,
		fbData: fbData,
		inIframe: inIframe
	}
}());