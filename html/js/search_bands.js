let search_val = ""
const resultBox = document.getElementById("resultbox");
const inputbox = document.getElementById("inputbox");
const filterBox = document.getElementById("openbtn");
let possiblecases = [];
var matches = "";
var response = null;


resultBox.style.display = "none";
onChangeListener = () => {
  $("#inputbox").val(search_val)
  console.log("onChangeListener")
}

$(document).ready(function () {

  $("#inputbox").on(
    "keyup",
    debounce(0, function () {
      if (!$("#resultBox").val()) {
        resultBox.style.display = "block";
        filterBox.style.display = "none";
      }
      if (!$("#inputbox").val()) {
        $("#resultbox").empty();
        resultBox.style.display = "none";
        filterBox.style.display = "block";
        $("#container").empty();
        search_val = $("#inputbox").val()
        updateCards();
        return;
      }
      search_val = $("#inputbox").val()
      $.ajax({
        type: "POST",
        url: "/find",
        dataType: "json",
        data: {
          search: $("#inputbox").val(),
        },
        traditional: true,

        success: function (retrievedData) {
          if (retrievedData == null) {
            $("#container").empty();
            $("#no-data").fadeIn("normal");
          } else {
            $("#no-data").hide();
          }
          //update response for openModal()
          response = retrievedData;
          possiblecases = [];
          possiblecases2 = [];
          bands_ids = [];
          $("#container").empty();
          $.each(retrievedData, function (_, value) {
            var members = "<br>";
            var id = value.BandId;

            $.each(value.Members, function (_, value) {
              members += value + "<br>";
            });

            $.each(value.MatchedOn, function (_, value) {
              possiblecases.push(value);
              bands_ids.push()
            });
            possiblecases2 = possiblecases;
            $.each(value.MatchedOn, function (_, value) {
              possiblecases = (value.split(','));
            });

            var matches = "";
            $.each(possiblecases, function (_, value) {
              matches += value + "<br>";
            });

            if (!$("#" + id).length) {
              $("#container")
                .append(
                  `<div class="rounded overflow-hidden shadow-lg bg-white max-w-fit">
                  <h4>${matches}</h4>
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
                      <button class="button" onclick="openModal(${id})">
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
                .fadeIn("fast");
            }
          });
          displayResult(possiblecases2);
        },
        error: function (_, _, errorThrown) {
          console.log(errorThrown);
        },
      });
    })
  );
});

function debounce(wait, func) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");

  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  if (
    splitStr[splitStr.length - 1] === "Usa" ||
    splitStr[splitStr.length - 1] === "Uk"
  ) {
    splitStr[splitStr.length - 1] = splitStr[splitStr.length - 1].toUpperCase();
  }
  return splitStr.join(" ");
}

expand = () => {
  $("#search").css('width', '350px');
}

un_expand = () => {
  if (!$("#search").val()) {
    $("#search").css('width', '80px');
    $("#search").blur()
  }
}


function displayResult(result) {
  let stuff = result.toString().split(",")
  let content = [];
  // $.each(stuff, function (_, value) {
  //   content.push("<li onclick=selectInput(this)>" + value + "</li>");
  // });
  for (let i = 0; i < stuff.length; i++) {
    var element = stuff[i];

    if (content.includes("<li onclick=selectInput(this)>" + element + "</li>")) {
      continue;
    }
    content.push("<li onclick=selectInput(this)>" + element + "</li>");
  }

  AppendResultBox(content);
}

function AppendResultBox(content) {
  resultBox.innerHTML = "";
  resultBox.innerHTML = "<ul>" + content.join("") + "</ul>";
}


function selectInput(list) {
  inputbox.value = list.innerHTML;
  resultBox.style.display = "none";
  UpdateContent(list);
}


function UpdateContent(modalReference) {
  //  console.log(modalReference.innerHTML.length);
  $("#container").empty();
  $.each(response, function (key, value) {
    targetCardIndex = -1;
    $.each(value.MatchedOn, function (_, value) {
      const value_array = value.split(",");
      for (let i = 0;i< value_array.length;i++){
        if (value_array[i] == modalReference.innerHTML) {
          targetCardIndex = key;
          break
        };
      };
    });

    if (targetCardIndex >= 0) {
      $("#container")
        .append(
          `<div class="rounded overflow-hidden shadow-lg bg-white max-w-fit">
            <img
              class=""
              src="${response[targetCardIndex].Image}"
              alt="${response[targetCardIndex].Name}"
            />
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2 text-center flex flex-wrap">
              <h3>${response[targetCardIndex].Name}</h3>
              </div>
              <div class="py-6 flex justify-center">
                <button class="button" onclick="openModal(${response[targetCardIndex].BandId})">
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
        .fadeIn("fast");
    };
  });

}

