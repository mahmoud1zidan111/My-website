// jQuery animate

let had = $(".intro-text");
let img = $(".section-one-img");
let myName = $("#all");

// عرض العنوان مع تأثير الانزلاق ثم إظهار الصورة والاسم بتأثيرات
had.slideDown(1000, function () {
  $(this).animate({ opacity: 1, bottom: "0%" }, 1000, function () {
    img.animate({ left: "0px", opacity: 1 }, 800, function () {
      myName.animate({ right: "0px", opacity: 1 }, 750);
    });
  });
});
