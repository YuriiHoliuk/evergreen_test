$(function() {
    bgInit();
    headerInit();
});

function bgInit() {
    $('.promo').backstretch([
        "http://loremflickr.com/1366/488/combine?random=1",
        "http://loremflickr.com/1366/488/combine?random=2",
        "http://loremflickr.com/1366/488/combine?random=3",
        "../img/promo_bg.jpg"
    ], {
        duration: 5000,
        fade: 500
    });
}

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
            hideMobileNav();
            clearHeader();
            buildHeader(getState());
            state = getState();
        }
    }

    function clearHeader() {
        $('.mobile-nav').empty();
        $('.header-top').empty();
        $('header').empty();
    }

    function buildHeader(state) {
        var h,
            m;
        if (state === 'desktop') {
            $top.append($logo).append($short).append($lang);
            h = $top.add($panel);
            $('.header').append(h);
        } else if (state === 'mobile') {
            $top.append($logo).append($toggle);
            $('.header').append($top);
            m = $lang.add($short).add($panel);
            $('.mobile-nav').append(m);

            $('.mobile-nav__toggle').on('click', toggleMobileNav);
        }
        state = getState();
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
            hideMobileNav();
        } else if (!($('.mobile-nav').hasClass('active'))) {
            showMobileNav();
        }
    }

    function hideMobileNav() {
        $('.mobile-nav').removeClass('active');
        $('.mobile-nav__toggle').removeClass('open');
        setTimeout(function() {
            $('.mobile-nav').hide();
        }, 500);
    }

    function showMobileNav() {
        $('.mobile-nav__toggle').addClass('open');
        $('.mobile-nav').show(0, function() {
            $('.mobile-nav').addClass('active');
        });
    }

}