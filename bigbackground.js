// Manage rendering of the large background images. Add slider where applicable.
var backgroundImages = function(){

	// Set some initial variables
	var backgroundContainer = $('#background'), 
		backgroundContainerList = backgroundContainer.find('ul'), 
		backgroundContainerListTotal = (backgroundContainerList.children('li').length - 1), 
		backgroundControls = $('#backgroundcontrols'), 
		backgroundControlLinks = backgroundControls.find('a'), 
		bgImageWidth = 1500, 
		bgImageHeight = 1200, 
		thisWin = $(window), 
		imgHeight, imgWidth, imgTop, imgLeft, 
		activeIndex = 0, 
		isThisMobile = false 

	function sizeImage(){
		
		// If mobile assume image size is halfed @todo tweakage.
		if(isThisMobile){ 
			bgImageWidth = bgImageWidth / 2; 
			bgImageHeight = bgImageHeight / 2; 
		}
		
		// Get Window Width, Image Ratio etc etc, needs to be here due to sizeImage being called on resize
		var widthToSet = thisWin.width(), 
			heightToSet = thisWin.height(), 
			ratioToSet = widthToSet / heightToSet,
			imageRatio = bgImageWidth / bgImageHeight;
				
		// Sort container width & height based on ratio
		if (ratioToSet > imageRatio) {
			imgHeight = (widthToSet / bgImageWidth) * bgImageHeight;
			imgWidth = widthToSet;
		} else {
			imgHeight = heightToSet;
			imgWidth = (heightToSet / bgImageHeight) * bgImageWidth;
		}	
		
		// Offset width & height based on ration
		imgTop = 0 - (imgHeight - heightToSet) / 2;
		imgLeft =  0 - (imgWidth - widthToSet) / 2;
					
		// Set width, height & offset on container & li items to display one at time only
		backgroundContainer.css({"height": imgHeight, "width": imgWidth, "top": imgTop, "left": imgLeft});
		backgroundContainer.find('li').css({"height": imgHeight, "width": imgWidth});
		
		// Set body height, mostly css will contain overflow auto on body element
		$('body').css({height : heightToSet});
		
		// Are background controls present? If position them half way on the screen - @todo replace 124, shouldn't be hardcoded.
		// Also in here, reposition ul margin on resize to ensure that the active image is always showing.
		if(backgroundControls.length){
				var bgControlTop = (thisWin.height() / 2) - (124 / 2);
				backgroundControls.css('top', bgControlTop);
				backgroundContainer.find('ul').css('marginLeft', 0 - (imgWidth * activeIndex));
		}
	
	}
	
	// Function that moves the list items.
	function switchBg(direction){
		
		var marg;
		
		// Calculate margin based on direction
		switch(direction){
		
			case 'prev':
			
				if(activeIndex == 0){
				
					marg = imgWidth * backgroundContainerListTotal;
					activeIndex = backgroundContainerListTotal;
					
				}else{
				
					activeIndex --;
					marg = imgWidth * activeIndex; 
					
				}
			
			break;
			case 'next':
				
				if(activeIndex == backgroundContainerListTotal){
				
					marg = 0;
					activeIndex = 0;
					
				}else{
				
					activeIndex ++;
					marg = imgWidth * activeIndex; 
					
				}
				
			break;
			
		}
		
		// Run animation on background container
		backgroundContainerList.fadeTo('fast', 0.2)
							   .delay(250)
							   .animate({'marginLeft': 0 - marg}, 1000)
							   .fadeTo('fast', 1);

		
	}
	
	// Bind swipe to div for mobile background transitions - @todo needs work!
	function bindSwipe(){
	
		$('.container').swipe({
     					swipeLeft: function() { switchBg('next'); },
     					swipeRight: function() { switchBg('prev');}
		});
	}

	// Public Functions
	return {
		
		// Run size image first & bind resize
		init:function(isMobile){
			
			isThisMobile = isMobile;
			
			// Run function on init & bind to resize
			sizeImage();
			thisWin.bind('resize', sizeImage);
			
			// If background controls bind click function
			if(backgroundControlLinks.length){
			
				backgroundControlLinks.bind('click', function(e){e.preventDefault(); switchBg($(this).attr('class'))});
			
			}
			
			// If using swipe
			if(isThisMobile){
			
				bindSwipe();
			
			}
			
		}
		
	
	}

}