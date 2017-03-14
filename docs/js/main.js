$(function() {
    bgInit();
    headerInit();
});

function headerInit() {
    var breakpoint = 900,
        state,
        $panel,
        $lang,
        $short,
        $toggle,
        $logo,
        $top;

    getElements();
    buildHeader(getState());

    $(window).resize(rebuildHeader);

    function rebuildHeader() {
        if (state !== getState()) {
            if (getState() === 'desktop' && $('mobile-nav__toggle').hasClass('open')) {
                toggleMobileNav();
            }
            clearHeader();
            buildHeader(getState());
            state = getState();
            console.log(state);
        }
    }

    function clearHeader() {
        $('.mobile-nav').empty();
        $('.header-top').empty();
        $('header').empty();
    }

    function buildHeader(state) {
        if (state === 'desktop') {
            $top.append($logo).append($short).append($lang);
            $('.header').append($top).append($panel);
        } else if (state === 'mobile') {
            $top.append($logo).append($toggle);
            $('.header').append($top);
            $('.mobile-nav').append($lang).append($short).append($panel);

            $('.mobile-nav__toggle').on('click', toggleMobileNav);
        }
        state = getState();
        console.log(state);
    }

    function getState() {
        return ($(window).width() >= breakpoint) ? 'desktop' : 'mobile'
    }

    function getElements() {
        $panel = $('.header-panel');
        $lang = $('.lang-switch');
        $short = $('.short-nav');
        $toggle = $('.mobile-nav__toggle');
        $logo = $('.logo');

        $('.header-top').empty();
        $('.mobile-nav').empty();

        $top = $('.header-top');

        $('.header').empty();
    }

    function toggleMobileNav() {
        if ($('.mobile-nav').hasClass('active')) {
            $('.mobile-nav').toggleClass('active');
            $('.mobile-nav__toggle').toggleClass('open');
            setTimeout(function() {
                $('.mobile-nav').hide();
            }, 500);
        } else if (!($('.mobile-nav').hasClass('active'))) {
            $('.mobile-nav__toggle').toggleClass('open');
            $('.mobile-nav').show(0, function() {
                $('.mobile-nav').toggleClass('active');
            });
        }
    }
}


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