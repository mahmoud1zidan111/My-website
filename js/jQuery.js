// jQuery animate

$(document).ready(function () {
  let had = $(".intro-text"); // اختيار العنصر باستخدام jQuery

  had
    .css({ display: "none", opacity: 0 }) // إخفاء العنصر وجعل الشفافية 0
    .slideDown(1000, function () {
      // إنزال العنصر من الأعلى للأسفل
      $(this).animate({ opacity: 1 }, 1000, function () {
        $("html, body").animate({ scrollTop: 476 }, 1500); // تمرير الصفحة بعد انتهاء التأثير
      });
    });
});
