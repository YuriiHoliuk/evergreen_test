$(document).ready(function() {
    bgInit();
});

function bgInit() {
    $('.promo').backstretch([
        "http://lorempixel.com/1366/488/nature",
        "http://lorempixel.com/1366/488/technics",
        "http://lorempixel.com/1366/488/sports",
        "../img/promo_bg.jpg"
    ], {
        duration: 5000,
        fade: 500
    });
}