const albumfrom = document.querySelector('#albumFrom');
const albumto = document.querySelector('#albumTo');
const foundedfrom = document.querySelector('#dateCreatedFrom');
const foundedto = document.querySelector('#dateCreatedTo');

albumfrom.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if (!isValid){
    alert("wrong dates")
  }
});
albumto.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if (!isValid){
    alert("wrong dates")
  }
});
foundedfrom.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if (!isValid){
    alert("wrong dates")
  }
});
foundedto.addEventListener('change', (e) => {
  const isValid = e.target.checkValidity();
  if (!isValid){
    alert("wrong dates")
  }
});


var checkboxes = ["dateCreated", "album", "members", "concerts", "bands"];
$("#reset-filter").hide();
$("#apply-filter").prop("disabled", true);

var requestData = {};

//Function for reset filters
var cleared = false;
$(document).ready(function () {
  $("#reset-filter").click(function () {
    $("#reset-filter").hide();
    $("#no-data").hide();
    $.each(checkboxes, function (_, box) {
      if ($("#" + box).is(":checked")) {
        cleared = true;
        $("#" + box).prop("checked", false);
        $("#" + box + "Input input").each(function () {
          $(this).val("");
        });
        $("#" + box + "Input").hide();
        $.each(countries, function (_, countryBox) {
          if ($("#" + countryBox).is(":checked")) {
            $("#" + countryBox).prop("checked", false);
          }
        });
        $.each(countries, function (_, bandBox) {
          if ($("#" + bandBox).is(":checked")) {
            $("#" + bandBox).prop("checked", false);
          }
        });
      }
    });
    if (cleared) {
      $("#slider-range").sl
      $("#slider-range").slider("values", 1, 10);
      $("#membersNum").text("1 - 10");
      $("#container").empty();
      updateCards(9);
      cleared = false;
    }
  });
});

var checkers = {
  dateCreated: checkCreationDate,
  album: checkFirstAlbumDate,
  members: checkMemberAmount,
  concerts: checkCountries,
  bands: checkBands,
};

$(".form").change(function () {
  if ($(".form input:checkbox:checked").length > 0) {
    $("#reset-filter").show();
    $("#apply-filter").prop("disabled", false);

  } else {
    $("#apply-filter").prop("disabled", true);
    $("#reset-filter").hide();
  }
});

$(document).ready(function () {
  $("#apply-filter").click(function () {
    $("#container").empty();
    $("#search").val("");
    $("#no-data").hide();

    response = {};
    requestData = {};
    $.each(checkboxes, function (_, box) {
      if ($("#" + box).is(":checked")) {
        checkers[box]();
      }
    });

    $.ajax({
      type: "POST",
      url: "/filter",
      dataType: "json",
      data: requestData,
      traditional: true,

      success: function (retrievedData) {
        response = retrievedData;
        if (response === null) {
          $("#no-data").show();
        } else {
          $.each(retrievedData, function (index, _) {
            appendCard(index);
          });
        }
      },
      error: function (errorThrown) {
        console.log(errorThrown);
        alert("500 Internal server error");
        window.open("http://localhost:8080/html/404/500.html", "_self")
      },
    });
    navControl("0", "");
    navOpened = false;
  });
});

function checkCreationDate() {
  var fromDate = parseInt($("#dateCreatedFrom").val());
  var toDate = parseInt($("#dateCreatedTo").val());

  if (Number.isNaN(toDate)) {
    toDate = 2019;
  }
  if (Number.isNaN(fromDate)) {
    fromDate = 1958;
  }
  requestData["creation-date-from"] = fromDate;
  requestData["creation-date-to"] = toDate;
}

function checkFirstAlbumDate() {
  var fromDate = parseInt($("#albumFrom").val());
  var toDate = parseInt($("#albumTo").val());

  if (Number.isNaN(toDate)) {
    toDate = 2019;
  }
  if (Number.isNaN(fromDate)) {
    fromDate = 1958;
  }

  requestData["first-album-date-from"] = fromDate;
  requestData["first-album-date-to"] = toDate;
}

function checkMemberAmount() {
  var membersFrom = parseInt($("#slider-range").slider("values", 0));
  var membersTo = parseInt($("#slider-range").slider("values", 1));

  requestData["members-from"] = membersFrom;
  requestData["members-to"] = membersTo;
}

function checkCountries() {
  var countriesFilter = "";
  $.each(countries, function (_, box) {
    if ($("#" + box).is(":checked")) {
      country = box.toLowerCase();
      if (countriesFilter.length < 1) {
        countriesFilter += country;
      } else {
        countriesFilter += "," + country;
      }
    }
  });
  requestData["countries"] = countriesFilter;
}

function checkBands() {
  var bandsFilter = "";
  $.each(countries, function (_, box) {
    if ($("#" + box).is(":checked")) {
      band = box.toLowerCase();
      if (bandsFilter.length < 1) {
        bandsFilter += band;
      } else {
        bandsFilter += "," + band;
      }
    }
  });
  requestData["bands"] = bandsFilter;
}

function appendCard(index) {
  console.log(index)
  $("#container")
    .append(
      `
      <div class="rounded overflow-hidden shadow-lg bg-white max-w-fit">
      <img
        class=""
        src="${response[index].Image}"
        alt="${response[index].Name}"
      />
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2 text-center flex flex-wrap">
        <h3>${response[index].Name}</h3>
        </div>
        <div class="py-6 flex justify-center">

          <button class="button" onclick="openModal(${response[index].BandId})">
            <span class="button_lg">
              <span class="button_sl"></span>
              <<span class="button_text">More Info</span>
            </span>
          </button>
        </div>
      </div>
    </div>`
    )
    .hide()
    .slideDown("normal");
}
