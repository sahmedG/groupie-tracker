let search_val = ""

onChangeListener = () => {
  $("#search").val(search_val)
  console.log("onChangeListener")
}

$(document).ready(function () {
  $("#search").on(
    "keyup",
    debounce(0, function () {
      if (!$("#search").val()) {
        $("#container").empty();
        search_val = $("#search").val()
        updateCards();
        return;
      }
      search_val = $("#search").val()
      $.ajax({
        type: "POST",
        url: "/find",
        dataType: "json",
        data: {
          search: $("#search").val(),
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
          $("#container").empty();
          $.each(retrievedData, function (_, value) {
            var members = "<br>";
            var id = value.BandId;
            var possiblecases = "";

            $.each(value.Members, function (_, value) {
              members += value + "<br>";
            });
            $.each(value.MatchedOn, function (key, value) {
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
                          <<span class="button_text">More Info</span>
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
