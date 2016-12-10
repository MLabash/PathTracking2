/*
start tracking:
1. store the current position every 10 seconds.
2. make the center of the map at the last position.
3. draw a polyline to refelct the stored path.

stop tracking:
1. stop storing the current location 
2. stop updating the map and the panorama.

clear history:
1. delete all previous stored locations.
2. re-center the map at the default point(location). 

preview: 
 1. display a table contains all stored locations and it's time.
*/

var trackingMode = true;
var trackingResult = [];
var trackingResultText = '[]';
var resultIndex = 0;
var map;
var trackingInterval;
var path = {};
var pathCoordinates = [];
var panorama = {};

/*****************************************************/
// init map and panorma
//show loader in waiting time
function init() {
    document.getElementById("loader").style.display = "block";
    initMap();
    document.getElementById("loader").style.display ="none";
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat : 52.377504, lng : 4.901979},
      zoom: 18
    });
    
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: {lat : 52.377504, lng : 4.901979},
            pov: {
                heading : 34,
                pitch : 10
            }
        });
}

/*****************************************************/
// Start tracking position or stop tracking.
// get the position every 10 seconds.

function startTracking() {
    if (trackingMode){
        document.getElementById("start-tracking").textContent = "Stop tracking";
        trackingInterval = setInterval(getPosition, 10000);
    }
    else{
        document.getElementById("start-tracking").textContent = "Start tracking";
        clearInterval(trackingInterval);
    }
    trackingMode = !trackingMode;
}

// get current position
function getPosition() {
    navigator.geolocation.getCurrentPosition(update)
}

// update map and store current position
function update(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      time: new Date()    
    };
    
    //update panorama and map center
    map.setCenter({lat : Number(pos.lat), lng : Number(pos.lng)});
    pathCoordinates.push({lat : Number(pos.lat), lng : Number(pos.lng)});
    panorama.setPosition({lat : Number(pos.lat),lng : Number(pos.lng)});
    updateMap();
    
    // store the position
    resultIndex++;
    var myString = (resultIndex == 1 ? '{' : ',{') + '"time":"' + pos.time + '",'+ '"lat":"' + pos.lat + '",' + '"lng":"' + pos.lng + '"}';
    trackingResultText = trackingResultText.slice(0, trackingResultText.length - 1) + myString + trackingResultText.slice(trackingResultText.length - 1);
}

// drow polyline on map to reflect the complete path
function updateMap(){
    //path.setMap(null);
    path = new google.maps.Polyline({
          path : pathCoordinates,
          geodesic : true,
          strokeColor : '#FF0000',
          strokeOpacity : 1.0,
          strokeWeight : 2
        });
        path.setMap(map);    
}
/****************************************************************/
// clear the stored coordinates
// re-center map in the default point 
function clearHistory() {
    trackingResultText = '[]';
    resultIndex = 0;
    panorama.setPosition({lat : 52.377504, lng : 4.901979});
    map.setCenter({lat : 52.377504,lng : 4.901979});    
    previewTracking();
}

/*************************************************************/
// Show table contains path coordinates.
// print the information stored in the JSON object
function previewTracking() {
    var trackingResult = JSON.parse(trackingResultText);
    var table = document.getElementById("track-info-table"); 
    
    if (trackingResult.length > 0) {    
        var tableRows = '';
        var index = 0;
        
        tableRows += '<th>Time</th><th>Latitude</th><th>Longitude</th>';
        for (index = 0; index < trackingResult.length;index++){
            //pathCoordinates.push({lat:Number(trackingResult[index].lat) ,lng:Number(trackingResult[index].lng)})    
            tableRows += '<tr> <td>'; 
            tableRows += (new Date(trackingResult[index].time).toLocaleString()); 
            tableRows += ' </td><td>';
            tableRows += trackingResult[index].lat;
            tableRows += ' </td><td>';
            tableRows += trackingResult[index].lng;
            tableRows += '</td> </tr> ';
        }
        table.innerHTML = tableRows;
       
    }
    else {
       table.innerHTML = '';  
    }
}
     

