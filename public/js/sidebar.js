const hideOrShowSlider = () => {
    $('.slider-menu').each(function (index) {
        // the slider is not hidden
        if ($('#FilterDropdown').find('input').eq(index).prop("checked")) {
            // hide slider when there's no menu item
            const parent = this;//you'll often see code like this
            parent.hide();
            $(this).each('.featured-responsive', function() {
                if($(this).display !== "none") {
                    parent.show();
                }
            });
        }
    });
};

const hideOrShowMenuItem = (inKey, exKey) => {
    $(".slider-menu .featured-responsive").each(function () {
        const menuItemName = $(this).find('h6').text().toLowerCase();
        const menuItemRecipe = $(this).find('ul li p').text().toLowerCase();

        $(this).show();
        if (exKey === undefined) {
            if (inKey !== undefined && menuItemName.indexOf(inKey) < 0
                && menuItemRecipe.indexOf(inKey) < 0) {
                $(this).hide();
            }
        } else {
            // hide the menu item which user doesn't like
            if (menuItemName.indexOf(exKey) > -1 || menuItemRecipe.indexOf(exKey) > -1) {
                $(this).hide();
            } else {
                // display the menu item which user likes
                if (inKey !== undefined && menuItemName.indexOf(inKey) < 0
                    && menuItemRecipe.indexOf(inKey) < 0) {
                    $(this).hide();
                }
            }
        }
    });
};

$(document).ready(function () {
    // display or hide sidebar
    $('#sidebar .dropdown-toggle').click(function () {
        const dropdownElem = $('.dropdown-toggle[aria-expanded="true"]');
        if (dropdownElem.length === 0 || (dropdownElem.length === 1
            && $(this).attr('href') === dropdownElem.eq(0).attr('href'))) {
            $('#sidebar').toggleClass('active');
        }
    });

    // display or hide slider
    $('input[type="checkbox"]').on('click', function () {
        const categoryName = $(this).next().text();
        if ($(this).prop("checked") === true) {
            const slider = $('#slider-' + categoryName);
            // no menu item to display
            if (slider.find('.featured-responsive:hidden').length > 0) {
                slider.fadeIn();
            }
        } else {
            $('#slider-' + categoryName).fadeOut();
        }
    });

    // search and exclude function
    let inKey = undefined,
        exKey = undefined;

    $("#search-input").on("keyup", function () {
        inKey = $(this).val().toLowerCase(); // TODO: regex match for alpha characters
        if (!inKey)
            inKey = undefined;
        hideOrShowMenuItem(inKey, exKey);
        // hideOrShowSlider();
    });

    $("#exclude-input").on("keyup", function () {
        exKey = $(this).val().toLowerCase();
        if (!exKey)
            exKey = undefined;
        hideOrShowMenuItem(inKey, exKey);
        hideOrShowSlider();
    });

    $('#sidebar-scrollup').click(function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 300);
    });
});

// scroll to the top of page
$(window).scroll(function () {
    const btnTop = $('#sidebar-scrollup');
    if ($(window).scrollTop() > 300) {
        btnTop.fadeIn();
    } else {
        btnTop.fadeOut();
    }
});