// jQuery animate

$(document).ready(function () {
  $(window).scrollTop(0);
  let had = $(".intro-text");
  had.slideDown(1000, function () {
    $(this).animate({ opacity: 1, bottom: 0 + "%" }, 1000, function () {
      $("html, body").animate({ scrollTop: 650 }, 600, function () {
        let myName = $("#all");
        let img = $(".section-one-img");
        $(img).animate({ left: 0 + "px", opacity: 1 }, 800, function () {
          $(myName).animate({ right: 0, opacity: 1 }, 750);
        });
      });
    });
  });
});
