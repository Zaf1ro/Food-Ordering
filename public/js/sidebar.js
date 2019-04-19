const hideOrShowSlider = () => {
    $('.slider-menu').each(function(index) {
        // the slider is not hidden
        if($('#CategoryDropdown').find('input').eq(index).prop("checked")) {
            $(this).show();
            // hide slider when there's no menu item
            if($(this).find('.featured-responsive:visible').length === 0) {
                $(this).hide();
            }
        }
    });
};

const hideOrShowMenuItem = (inKey, exKey) => {
    $(".slider-menu .featured-responsive").filter(function () {
            const menuItemName = $(this).find('h6').text().toLowerCase();
            const menuItemRecipe = $(this).find('ul li p').text().toLowerCase();

            $(this).show();
            if (!exKey) {
                if (inKey && menuItemName.indexOf(inKey) < 0
                    && menuItemRecipe.indexOf(inKey) < 0) {
                    $(this).hide();
                }
            } else {
                // hide the menu item which user doesn't like
                if (menuItemName.indexOf(exKey) > -1 || menuItemRecipe.indexOf(exKey) > -1) {
                    $(this).hide();
                } else {
                    // display the menu item which user likes
                    if (inKey && menuItemName.indexOf(inKey) < 0
                        && menuItemRecipe.indexOf(inKey) < 0) {
                        $(this).hide();
                    }
                }
            }
        }
    );
};

$(document).ready(function () {
    $(".dropdown-toggle").click(function(){
        $(this).next().css({
            "background": "transparent url(../images/sidebar/bg_black.png) repeat top left",
            "opacity": "0.8"
        })
    });

    // display or hide sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#sidebarCollapse').toggle();
    });

    $('#dismiss').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#sidebarCollapse').toggle();
    });

    // display or hide slider
    $('input[type="checkbox"]').on('click', function () {
        const categoryName = $(this).next().text();
        if ($(this).prop("checked") === true) {
            const slider = $('#slider-' + categoryName);
            // no menu item to display
            if(slider.find('.featured-responsive:hidden').length > 0) {
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
        inKey = $(this).val().toLowerCase(); // TODO regex match for alpha characters
        if (!inKey || inKey.length < 2)
            inKey = undefined;
        hideOrShowMenuItem(inKey, exKey);
        hideOrShowSlider();
    });

    $("#exclude-input").on("keyup", function () {
        exKey = $(this).val().toLowerCase();
        if (!exKey || exKey.length < 2)
            exKey = undefined;
        hideOrShowMenuItem(inKey, exKey);
        hideOrShowSlider();
    });
});