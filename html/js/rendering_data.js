var response = null;
var map = null;
var mapMarkers = [];
var mapCreated = false;
var targetCardIndex = -1;
updateCards();

function updateCards() {
  $(document).ready(function () {
    return $.ajax({
      type: "POST",
      url: "/artists",
      dataType: "json",
      traditional: true,

      success: function (retrievedData) {
        $("#no-data").hide();
        $("#container").empty();
        response = retrievedData;
        $.each(retrievedData, function (_, value) {
          $("#container")
            .append(
              ` 
              <div style="margin:auto;" class="rounded overflow-hidden shadow-lg bg-white max-w-fit">
              <img
                class=""
                src="${value.Image}"
                alt="${value.Name}"
              />
              <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2 text-center flex flex-wrap">
                <h3>${value.Name}</h3>
                </div>
                <div class="py-6 flex justify-center">
                
                  <button class="button" onclick="openModal(${value.BandId})">
                    <span class="button_lg">
                      <span class="button_sl"></span>
                      <span class="button_text">More Info</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>`
            )
            .hide()
            .slideDown("normal");
        });
      },
      error: function (_, _, errorThrown) {
        console.log(errorThrown);
        alert("500 Internal server error");
      },
    });
  });
}

function openModal(modalReference) {
  $(document).ready(function () {
    targetCardIndex = modalReference;
    $.each(response, function (key, value) {
      if (value.BandId === modalReference) {
        targetCardIndex = key;
        return false;
      }
    });
    if (targetCardIndex < 0) {
      alert("400 Bad request");
      return false;
    }
    var concertDates = "<br>";
    var locName = "";
    var alldata = "";
    var membersList = "";
    $.each(response[targetCardIndex].Members, function (_, value) {
      membersList += value + ",  ";
    });

    $("#modal").modal("show");

    $.each(response[targetCardIndex].RelationStruct, function (key, _) {
      locName = key
      locName = locName = locName.replace(/_/g, " ");
      locName = titleCase(locName);
      alldata += locName + ",  "
      $.each(
        response[targetCardIndex].RelationStruct[key],
        function (_, value) {
          concertDates += value.replace(/-/g, "/");
          concertDates = concertDates + ",";
        }
      );

    });

    alldata = alldata.slice(0, -3)
    membersList = membersList.slice(0, -3)
    document.getElementById("F_Adate").innerHTML = response[targetCardIndex].FirstAlbum.replace(/-/g, "/");
    document.getElementById("modal-body-concerts").innerHTML = (alldata);
    document.getElementById("crdate").innerHTML = response[targetCardIndex].CreationDate;
    document.getElementById("modal-body-members").innerHTML = membersList;
    document.getElementById("modal-img").src = response[targetCardIndex].Image;
    document.getElementById("modal-title").innerHTML = (response[targetCardIndex].Name);
    if (!mapCreated) {
      createMap();
      mapCreated = true;
    }
    FetchLocCodes();
    ymaps.ready(updateMarkers());
  });
}

function FetchLocCodes() {
  var query = "";
  $.each(response[targetCardIndex].RelationStruct, function (key, _) {
    if (query.length < 1) {
      query += key;
    } else {
      query += "," + key;
    }
  });

  $.ajax({
    async: false,
    type: "POST",
    url: "/geocode",
    data: {
      query: query,
    },
    dataType: "json",
    success: function (response) {
      mapMarkers = response;
    },
  });
  //console.log(mapMarkers)
}

function createMap() {
  map = new ymaps.Map("map", {
    center: [45.58329, 24.761017],
    zoom: 1,
  });
}
var Dates = []
function updateMarkers() {
  map.geoObjects.removeAll();
  $.each(mapMarkers, function (_, index) {
    var concertDates = "<br>";
    var locName = index.Name.replace(/-/g, ", ");
    locName = locName = locName.replace(/_/g, " ");
    locName = titleCase(locName);
    $.each(
      response[targetCardIndex].RelationStruct[index.Name],
      function (_, value) {
        concertDates += value + "<br>";
        Dates.push(concertDates)
      }
    );

    // new google.maps.Marker({
    //   position: [index.Coords[0], index.Coords[1]],
    //   label: labels.length.toString(),
    //   map: map,
    //   title:locName + concertDates,
    // });

    map.geoObjects.add(
      new ymaps.Placemark([index.Coords[0], index.Coords[1]], {
        // iconContent : Dates.length.toString(),
        balloonContentHeader: locName + concertDates,
        iconCaption: Dates.length.toString(),
        //  hintContent: Dates.length.toString(),
      }, {
        preset: "islands#blueNightClubIcon",
      })
    );
    Dates = []
  });
  mapMarkers = [];
}


const labels = ["Banana", "Orange", "Apple", "Mango"];
let labelIndex = 0;

function initMap() {
  const mapcenter = { lat: 45.58329, lng: 24.761017 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: mapcenter,
  });

  // This event listener calls addMarker() when the map is clicked.
  // Add a marker at the center of the map.
  addMarker(mapcenter, map);
}

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.

}

window.initMap = initMap;