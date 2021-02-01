let defProps = {
    step: {
        months: 1
    },
    bounds: {
        min: new Date(2012, 1, 1),
        max: new Date()
    },
    defaultValues: {
        min: new Date(2012, 1, 1),
        max: new Date()
    }
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
        $('#slider').dateRangeSlider("values",
            defProps.defaultValues.min, defProps.defaultValues.max);
        $('#all').prop('checked', true);
        $('.place').prop('disabled', true);
        $('.label-place').css('color', '#777');
    });
    $("#slider").dateRangeSlider(defProps);
    $('#all').prop('checked', true);
    $('.place').prop('disabled', true);
    $('.label-place').css('color', '#777');
    $('#all').click(function() {
        $('.place').prop('disabled', $(this).is(':checked'));
        $(this).is(':checked') ?
            $('.label-place').css('color', '#777') : $('.label-place').css('color', "#000");
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