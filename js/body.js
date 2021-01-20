var Units = {
    months: 'months'
};

var myChart;

$().ready(() => {
    $('.expand-area').click(() => {
        $('.expand-area').addClass('glow').delay(250).queue((next) => {
            $('.expand-area').removeClass('glow');
            next();
        })
        $('.expand-area').toggleClass('expanded');
        $('.filter-body').slideToggle().css('display', 'grid');
    });
    $('#unit').click(() => {
        $('#get').html($('#unit').val() + ':');
    });
    $('.add-button').click(() => {
        $('.modal-window').addClass('show-up');
    });
    $('.modal-close').click(() => {
        $('.modal-window').removeClass('show-up');
    });
    $('#filter-reset').click(() => {
        $('#unit').val(Units.days);
        $('#count').val(7);
        $('#get').html(Units.days);
        applyFilter(Units.days, 7);
    });
    //canvasSet();
});

var applyFilter = (units, count) => {

}

var canvasSet = (l, d) => {
    var ctx = document.getElementsByClassName('chart-canvas')[0].getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: l,
            datasets: [{
                label: 'Units consumed',
                data: d,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    $('.canvas-placeholder').hide();
}