/*
content.js
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.content= (function(){
	//vars
	var tickerNr=1;
	var ticker=true;
	
	//get Content from the Guardian. 
	/*
	obj needs:
	.section -> used to write the content on the right section on the site.
	obj can have:
	.location (land or world)
	.edition (uk/us/au)
	.interest (...)
	.number (of articless to output)
	*/
	function getGuardian(obj){
		console.log("getGuardian called");
		//vars
		var url = "http://content.guardianapis.com/";
		var fields = "&show-fields=byline,trailText";
		var key = "?api-key=czwd98htekjvaagsapfur98h";
		var size = "&page-size=";
		//set section
		//section = obj.section;
		//Build URL with obj
		
		if(obj.location){
			if(obj.location=="world"){
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
		$.ajaxSetup({ cache: false }); //Guardian content should not be cached
		$.ajax({
		  dataType: "jsonp",
		  url: url,
		  data: null,
		  success: function(data){
		  receive(data, obj.section)
		  }
		});
	};
	
	function receive(obj, section){
		console.log("receive called");
		//if it's ticker data call ticker function
		if(section=="ticker"){
			setTicker(obj);
			return;
		}
		
		// if there's an error, print a message and return
		if(obj.response.status=="error"){
			var status = obj.response.status;
			var message = obj.response.message;
			document.querySelector(section).innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + message + "</i><p>";
			$(section).fadeIn(500);
			return; // Bail out
		}
		
		// If there is an array of results, loop through them
		var articles = obj.response.results;
		//establish bigString
		var bigString;
		if(obj.response.edition){
			bigString="<h3>"+obj.response.edition.webTitle+"</h3><hr />";
		}
		if(obj.response.section){
			bigString="<h3>"+obj.response.section.webTitle+"</h3><hr />";
		}
		if(obj.response.tag){
			bigString="<h3>"+obj.response.tag.webTitle+"</h3><hr />";
		}
		
		// loop through events here
		// concatenate HTML to bigString as necessary
		for (var i=0;i<articles.length;i++){
			var article = articles[i];
			
			var title = article.webTitle;
			var date = article.webPublicationDate;
			var url = article.webUrl;
			var lead = article.fields.trailText;
			var author = article.fields.byline;
			
			var line = "<div class='article'>";
			line += "<a href='" + url + "' target='_blank'><h4>" + title + "</h4>";
			line += "<p>" + lead + ".</p> ";
			line += "<small><i> Author: " + author + ". Date:" + date + "</i></small>";
			line += "</a></div>";
			bigString += line;
			bigString += "<hr />";
		}
		
		document.querySelector(section).innerHTML = bigString;
		$(section).fadeIn(500);
	};
	
	function setTicker(obj){ //builds ticker
		var articles = obj.response.results;
		var tag;
		if(obj.response.edition){
			tag=obj.response.edition.webTitle;
		}
		if(obj.response.section){
			tag=obj.response.section.webTitle;
		}
		if(obj.response.tag){
			tag=obj.response.tag.webTitle;
		}
		
		for (var i=0;i<articles.length;i++){
			var article = articles[i];
			//build content
			var line = "<a href='" + article.webUrl + "' target='_blank'>" + tag + ": " + article.webTitle;
			//set content into site
			document.querySelector("#t"+i).innerHTML = line;
		}
		$("#t0").fadeToggle("fast");
		runTicker();
	};
	
	function runTicker(){ //changes content shown by the ticker on site
		var oldTickerNr=tickerNr-1;
		if(oldTickerNr<0){
			oldTickerNr=4;
		}
		$("#t"+oldTickerNr).hide();
		$("#t"+tickerNr).fadeToggle(400);
		tickerNr++;
		if(tickerNr>=5){
			tickerNr=0;
		}
		if(ticker){
			setTimeout(runTicker, 10000);
		}
	};
	
	//Functions to public
	return{
		getGuardian: getGuardian,
		ticker: ticker
	}

}());