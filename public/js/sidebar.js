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
    )
};

$(document).ready(function () {
    // display or hide sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    // display or hide category of menu items
    $('input[type="checkbox"]').on('click', function () {
        const categoryName = $(this).next().text();
        if ($(this).prop("checked") === true) {
            $('#slider-' + categoryName).fadeIn();
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
    });

    $("#exclude-input").on("keyup", function () {
        exKey = $(this).val().toLowerCase();
        if (!exKey || exKey.length < 2)
            exKey = undefined;
        hideOrShowMenuItem(inKey, exKey);
    });
});