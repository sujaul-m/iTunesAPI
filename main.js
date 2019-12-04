// Get request from iTunes API
function getRequest (url, callback){
  var xml = new XMLHttpRequest();

  xml.onreadystatechange = function() {
    if(xml.readyState == 4 && xml.status == 200) {
      callback(xml.responseText);
    }
  }
  xml.open("GET", url, true);
  xml.send();
}

// Convert duratio response from milliseconds to minutes
function milliToMinutes(millis){
  let minutes = Math.floor(millis / 60000);
  let seconds = Math.round((millis % 60000) / 1000);

  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// Loop through response and put them in html table tags
function setTable(response){
  let duration = milliToMinutes(response.trackTimeMillis);

  let output = `
    <tr>
      <td tableHeadData="Artist: ">${response.artistName}</td>
      <td tableHeadData="Album: ">${response.collectionName}</td>
      <td tableHeadData="Track: ">${response.trackName}</td>
      <td tableHeadData="Genre: ">${response.primaryGenreName}</td>
      <td tableHeadData="Length: ">${duration}</td>
      <td tableHeadData="Price: ">$${response.trackPrice}</td>
      <td tableHeadData="View: "><a href=${response.trackViewUrl} target="_blank">View</a></td>
      <td tableHeadData="Artwork: " style="border-right: none;"><img class="artwork" src="${response.artworkUrl100}" alt="Album Artwork">
    </tr>`

    return output;
}

// Build table from response
function buildTable(response){
  response.forEach(function(response) {
    let row = setTable(response);

    document.getElementById('tableBody').innerHTML += row;
  })
}

let btn = document.querySelector('.btn');

// Handler for search button

btn.addEventListener('click', function(){

  // Clear Table of any previous results
  document.getElementById('tableBody').innerHTML = '';

  // Get the search term entered in input bar by user
  let searchTerm = document.getElementById("searchBar").value;

  // Get Ready to make getRequest
  let baseUrl = "https://itunes.apple.com/search";
  let fullUrl = baseUrl + "?term=" + searchTerm + "&kind=song";

  // Make Request
  getRequest(fullUrl, function(res) {
    let response = JSON.parse(res);

    // Check to see if there are any responses returned
    if(response.results.length == 0) {
      document.getElementById('noResults').style.visibility = "visible";
      document.querySelector('.tableContainer').style.visibility = "hidden";
    } else {
      document.getElementById('noResults').style.visibility = "hidden";
      buildTable(response.results);
      document.querySelector('.tableContainer').style.visibility = "visible";
    };
  })

 // Remove search tern from search bar
  document.getElementById('searchBar').value = '';
});
