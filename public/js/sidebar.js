$(document).ready(function () {
    const dishInfo = $('.dish-info-wrap');
    const food_names = dishInfo.find('h6').text().toLowerCase();
    const recipes = dishInfo.find('ul li p').text().toLowerCase();
    const totalText = food_names + " " + recipes;

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('input[type="checkbox"]').on('click', function () {
        const categoryName = $(this).next().text();
        if ($(this).prop("checked") === true) {
            $('#slider-' + categoryName).fadeIn();
        } else {
            $('#slider-' + categoryName).fadeOut();
        }
    });

    $("#search-input").on("keyup", function () {
        const keyword = $(this).val().toLowerCase();
        $(".slider-menu .dish-info-wrap").filter(function () {
            $(this).toggle(
                $(this).find('h6').text().toLowerCase().indexOf(keyword) > -1
                || $(this).find('ul li p').text().toLowerCase().indexOf(keyword) > -1
            );
        });
    });
});