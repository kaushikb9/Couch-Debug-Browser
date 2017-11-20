chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action === "log" ) {
    	var log = [];
    	var item = 0;
    	colors = ["black", "forestgreen", "magenta", "blue", "red", "indigo", "green", "brown"];

    	for(key in request.data){
    		if(key !== "index"){
    			if(request.data["index"]){
    				log.push("%c "+request.data[key]);
    			}else{
    				log.push("%c "+key);
    			}
    			item++;	
    		}
    	}
    	log = [log.join(" ")];

    	colors.forEach( (color, index) => {
    		if(index < item){
	    		if(request.data["index"]){	
		    		log.push("color: "+color);
	    		}else{
	    			log.push("background: yellow; color: "+color);
	    		}
    		}
    	})
      console.log.apply(console, log);
    }
  }
);