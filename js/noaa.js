function OrientView() {

	window.scrollTo(0,window.innerHeight * 2);

}

function BookmarkBubble() {

	window.setTimeout(function() {

		var bubble = new google.bookmarkbubble.Bubble(),

			parameter = 'bmb=1';

		bubble.hasHashParameter = function() {

			return window.location.hash.indexOf(parameter) != -1;

		};

		bubble.setHashParameter = function() {
			
			if (!this.hasHashParameter()) {
			
				window.location.hash += parameter;
				
			}
			
		};

		bubble.getViewportHeight = function() {
		
			return window.innerHeight;
			
		};

		bubble.getViewportScrollY = function() {
		
			return window.pageYOffset;
			
		};

		bubble.registerScrollHandler = function(handler) {
		
			window.addEventListener('scroll', handler, false);
			
		};

		bubble.deregisterScrollHandler = function(handler) {
		
			window.removeEventListener('scroll', handler, false);
			
		};

		bubble.showIfAllowed();
		
	}, 500);

	
}

window.addEventListener("load", function() {
	
	OrientView();
	
	BookmarkBubble();

	
}, false);


if (typeof socktan === "undefined") {

	var socktan = {};

};

socktan.init = function() {

	socktan.noaa.init();
	
};

socktan.tools = {

	init: function () {
	
		var gBmB = new google.bookmarkbubble;

	}, 

	DayOfYear: function(myDate) {

		var theYear = myDate.getYear(), 
		
			theMonth = myDate.getMonth(), 
			
			theDate = myDate.getDate(), 
			
			monthDays = [31,29,31,30,31,30,31,31,30,31,30,31], 
			
			theDayOfTheYear = 0, 
			
			i = 0;
		
		if (myDate.getYear() % 4) monthDays[1] = 28;		// Check for leap year
		
		for (i; i < theMonth; i++) theDayOfTheYear += monthDays[i];
		
		theDayOfTheYear += theDate;
		
		return theDayOfTheYear;
		
	}, 

	PadZeroes: function(i,places) {
		
		var  j = 0, 
		
			theString = "";
		
		theString += i;

		for (j; j < places; j++) {
		
			if (theString.length < places) {
			
				theString = "0" + theString;
				
			}
		
		}
		
		return theString;

	}, 

	ParseMinutes: function(i) {

		if (i < 30) {
		
			i = 0;

		} else {
		
			i = 30;
		
		}
		
		return i;
		
	}
	
}
	
socktan.noaa = {

	init: function () {
	
		var theEnhancement = document.getElementById("theEnhancement"), 
		
			theButton = document.getElementById("theButton"), 
			
			filePath = "http://www.ssd.noaa.gov/goes/west/weus/img/", 
		
			imageCode = "rb";
		
		socktan.noaa.loadImages(imageCode,filePath);
		
		theButton.addEventListener("click", socktan.noaa.changeEnhancement);

		LoopIt(0);

	}, 
	
	changeEnhancement: function() {
		
		var imageWrapper = document.getElementById("imageWrapper"), 
		
			n = 0;
			
		for (n; n < theEnhancement.length; n++) {
		
			if (theEnhancement[n].selected) {
				
				socktan.noaa.removeImages(imageWrapper);

				socktan.noaa.loadImages(theEnhancement[n].value, "http://www.ssd.noaa.gov/goes/west/weus/img/");
			
			}
		
		}
		
		theButton.addEventListener("click", socktan.noaa.changeEnhancement);
	
	}, 
	
	removeImages: function(imageWrapper) {
			
		while (imageWrapper.firstChild) {
		
		  imageWrapper.removeChild(imageWrapper.firstChild);
		  
		}
		
	}, 
	
	loadImages: function(imageCode,filePath) {
	
		var theYear = "", 
			
			theDays = "", 
			
			theMinutes = "", 
			
			theHours = "", 
			
			frameNumber = 0, 
		
			thePast = new Date(), 
			
			imageElement = new Image(720,480), 
			
			imageWrapper = document.getElementById("imageWrapper"), 
			
			theImages = document.getElementsByClassName("imageFrame"), 
			
			regions = "/west/weus/img", 
			
			serverPath = "http://www.ssd.noaa.gov/goes";

		thePast.setHours(thePast.getHours() - 4);
		
		if (filePath === null || filePath === "") filePath = "http://www.ssd.noaa.gov/goes/west/weus/img/";
		
		for (frameNumber; frameNumber < 20; frameNumber++) {
		
			imageElement = new Image(720,480), 
			
			thePast.setMinutes(thePast.getMinutes() + 30);

			theYear = thePast.getFullYear();
			
			theDays = socktan.tools.DayOfYear(thePast);

			theHours = socktan.tools.PadZeroes(thePast.getHours(),2);
			
			theMinutes = thePast.getMinutes();
			
			theMinutes = socktan.tools.ParseMinutes(theMinutes);
			
			theMinutes = socktan.tools.PadZeroes(theMinutes,2);
			
			imageElement.setAttribute("class", "hidden imageFrame");
			
			imageElement.id = "image" + socktan.tools.PadZeroes(frameNumber,2);

			imageElement.alt = "image" + socktan.tools.PadZeroes(frameNumber,2);

			imageElement.src = filePath + theYear + theDays + "_" + theHours + theMinutes + imageCode + ".jpg";
			
			imageWrapper.appendChild(imageElement);
	
		}

	}
	
}

function LoopIt(f) {

	var theInterval = 200, 
		
		theImages = document.getElementsByClassName("imageFrame"), 
		
		imageWrapper = document.getElementById("imageWrapper");

	setTimeout(function() {
	
		// Frames 0 - 18
		
		if (f === 0) {
		
			theImages.item(f).setAttribute("class", "imageFrame");
			
		}
			
		if (f < theImages.length - 1) {
		
			theImages.item(f).setAttribute("class", "hidden imageFrame");
		
			f++;
		
			theImages.item(f).setAttribute("class", "imageFrame");
	
			LoopIt(f);

		// Last frame	
		
		} else {
				
			theImages.item(f).setAttribute("class", "hidden imageFrame");
		
			theImages.item(0).setAttribute("class", "imageFrame");
		
			LoopIt(0);
	
		}
		
	}, theInterval);
	
}
	
socktan.init();