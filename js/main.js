function copyStringToClipboard(str) {
  // Create new element
  var el = document.createElement("textarea");
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand("copy");
  // Remove temporary element
  document.body.removeChild(el);
}

// geo IP fill
$(".delivery-city").html(`Enrico City, 104, Ohio`);
$.get("https://api.ipify.org?format=json", function(data) {
  $.get(`https://ipapi.co/${data.ip}/json/?key=c0cb653a302a359c7f7ebe6803396e50451aaa43`, function(ipData) {
    $(".delivery-city").html(`${ipData.city} ${ipData.postal}`);
  });
});

$("#search-box").on("submit", e => {
  e.preventDefault();

  window.location = "/";
});

// mobile share sheet API
$(".share-button").on("click", e => {
  e.preventDefault();

  if (navigator.share) {
    navigator
      .share({
        title: "",
        text: "share this link",
        url: "https://enricozon.cranci.xyz"
      })
      .then(() => console.log("Successful share! 🎉"))
      .catch(err => console.error(err));
  } else {
    copyStringToClipboard("https://enricozon.cranci.xyz");
    $(".link-copied-to-clipboard").addClass("animate-in");
  }
});

// add to card / buy now modal
const modal = MicroModal.init();

$(".add-to-cart, .buy-now").on("click", () => {
  const selected_interest = $(".interest-button.selected").text();
  const selected_demeanor = $("#select-demeanor option:selected").text();
  const selected_quantity = $("#select-quantity option:selected").text();

  $(".demeanor").text(selected_demeanor);
  $(".interested-in").text(selected_interest);

  if (selected_quantity !== "1") {
    $(".interested-in").text(
      `${selected_interest} (Pack of ${selected_quantity})`
    );
  }

  const loading_spinner = $(".order-loading");

  $(".single-product").hide();
  $("#reviews").hide();
  loading_spinner.show();
  $(".reviews-breaker").hide();
  setTimeout(() => {
    loading_spinner.hide();
    MicroModal.show("modal-1");
  }, 500);

  document.title = "Checkout | Enricozon";
});

// Set selected on first image in gallery initially
$(".product-gallery > img:first-child").addClass("selected");

// gallery stuff
$(".product-gallery > img").on("mouseenter", e => {
  $("#gallery-selected").attr("src", $(e.target).attr("src"));
  $("#gallery-selected").attr("thumbcount", $(e.target).attr("thumbcount"));
  $(".product-gallery img").removeClass("selected");
  $(e.target).addClass("selected");
});

const gallery_array = document.querySelectorAll(".product-gallery > img");
let gallery_photos = [];

gallery_array.forEach(photo => {
  gallery_photos.push(photo.src);
});

$("#gallery-selected-container").hover(
  function() {
    if (window.innerWidth >= 520) {
      $("#gallery-selected-container").zoom({ magnify: "1" });
      setTimeout(function() {
        $('#gallery-selected-container img[role="presentation"]').css(
          "opacity",
          "1"
        );
      }, 50);
    }
  },
  function() {
    if (window.innerWidth >= 520) {
      $("#gallery-selected-container").trigger("zoom.destroy");
    }
  }
);

$("#gallery-selected").on("swipeleft", function(e, data) {
  const max_count = $(".product-gallery > .thumb").length - 1;
  if ($(e.target).attr("thumbcount") < max_count) {
    $("#gallery-selected").animate({ left: -500, opacity: 0.5 }, 300);

    setTimeout(function() {
      const photo_index = Number($(e.target).attr("thumbcount")) + 1;

      $("#gallery-selected").attr({
        thumbcount: photo_index,
        src: gallery_photos[photo_index]
      });
      $(".product-gallery > img").removeClass("selected");
      $(
        `.product-gallery img[thumbcount="${$(e.target).attr("thumbcount")}"]`
      ).addClass("selected");
    }, 200);

    $("#gallery-selected").animate({ left: 0 }, 0);
    $("#gallery-selected").animate({ opacity: 1 }, 0);
  }
});

$("#gallery-selected").on("swiperight", function(e, data) {
  if ($(e.target).attr("thumbcount") != "0") {
    $("#gallery-selected").animate({ left: 500, opacity: 0.5 }, 300);

    setTimeout(function() {
      const photo_index = Number($(e.target).attr("thumbcount")) - 1;

      $("#gallery-selected").attr({
        thumbcount: photo_index,
        src: gallery_photos[photo_index]
      });
      $(".product-gallery > img").removeClass("selected");
      $(
        `.product-gallery img[thumbcount="${$(e.target).attr("thumbcount")}"]`
      ).addClass("selected");
    }, 200);

    $("#gallery-selected").animate({ left: 0 }, 0);
    $("#gallery-selected").animate({ opacity: 1 }, 0);
  }
});

// interests
$(".interests button").on("mouseenter", e => {
  $("#interest").text($(e.target).data("interest"));
});

$(".interests button").on("click", e => {
  $("#interest").text($(e.target).data("interest"));
  $(".interests button").removeClass("selected");
  $(e.target).addClass("selected");
});

$(".interests button").on("mouseleave", e => {
  $("#interest").text($(".interests button.selected").data("interest"));
});

// dynamic time for shipping
function roundToNearestHour(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0);

  return date;
}

if ($(".checkout--shipping").length) {
  const currentTime = roundToNearestHour(new Date());
  const extraHour = moment(currentTime)
    .add(1, "h")
    .format("ha");
  const option1 = `Today, by ${extraHour}`;

  let option2 = `Today, by 9pm`;
  if (moment(currentTime).hour() > 19) {
    option2 = `Today, by midnight`;
  }

  $("#chk-1").val(option1);
  $('label[for="chk-1"] strong').text(option1);
  $("#arriving-by").text(option1);

  $("#chk-2").val(option2);
  $('label[for="chk-2"] strong').text(option2);
}

$('[name="checkout"]').on("change", e => {
  $("#arriving-by").text(e.target.value);
});

// faux checkout
$(".place-order").on("click", () => {
  const loading_spinner = $(".order-loading");

  $(".main-navbar").addClass("trim-nav");
  loading_spinner.show();
  $(".reviews-breaker").hide();
  setTimeout(() => {
    loading_spinner.hide();
    $(".order-placed").show();
  }, 1000);
  MicroModal.close("modal-1");
  document.title = "Thanks You, For using Enricozon";
});
;
