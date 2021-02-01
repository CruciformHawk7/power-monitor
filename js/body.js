const apiUrl = "http://192.168.0.105:8080";

let defProps = {
    step: {
        months: 1
    },
    bounds: {
        min: new Date(2017, 7, 1),
        max: new Date()
    },
    defaultValues: {
        min: new Date(2017, 7, 1),
        max: new Date()
    }
};

var myChart;

$().ready(() => {
    initChart();
    $('.chart-canvas').hide();
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
    $('#filter-go').click(() => {
        var from, to, locations;
        var slider = $('#slider').dateRangeSlider("values");
        from = slider.min;
        to = slider.max;

        formatFrom = `${from.getMonth() < 9 ? "0" + (from.getMonth()+1) : from.getMonth()+1}${from.getFullYear()}`;
        formatTo = `${to.getMonth() < 9 ? "0" + (to.getMonth()+1) : (to.getMonth()+1)}${to.getFullYear()}`;

        if ($('#all').is(':checked')) locations = ['ATM', 'Dreamland', 'Ganika', 'Grace', 'Honest',
            'Jacobz', 'Sabu\'s', 'Sports', 'Terry\'s', 'Xerox'
        ];
        else {
            locations = [];
            if ($('#atm').is(':checked')) locations.push('ATM');
            if ($('#dreamland').is(':checked')) locations.push('Dreamland');
            if ($('#ganika').is(':checked')) locations.push('Ganika');
            if ($('#grace').is(':checked')) locations.push('Grace');
            if ($('#honest').is(':checked')) locations.push('Honest');
            if ($('#jacobz').is(':checked')) locations.push('Jacobz');
            if ($('#sabus').is(':checked')) locations.push('Sabu\'s');
            if ($('#sports').is(':checked')) locations.push('Sports');
            if ($('#terrys').is(':checked')) locations.push('Terry\'s');
            if ($('#xerox').is(':checked')) locations.push('Xerox');
        }
        //console.log(`${locations.toString()} ${formatFrom} ${formatTo}`);
        $.post({
            //url: apiUrl + '/api/data/get',
            url: apiUrl + `/api/data/get?TimeFrom=${formatFrom}&TimeTo=${formatTo}&Locations=${locations.toString()}`,
            // jQuery doesn't play well even with Strings, strange.
            // data: {
            //     TimeFrom: `${formatFrom}`,
            //     TimeTo: `${formatTo}`,
            //     Locations: `${locations.toString()}`
            // },
            success: (response) => {
                updateChart(response, locations, from, to);
            }
        })
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
    $('#filter-go').click();
});

var updateChart = (resp, locations, from, to) => {
    $('.canvas-placeholder').show();
    $('.chart-canvas').hide();
    var dse = [];
    var labels = [];

    for (var d = from; d < to; d.setMonth(d.getMonth() + 1)) {
        var s = '';
        s += d.toLocaleString('default', { month: 'short' });
        s += ` ${d.getFullYear()}`;
        labels.push(s);
    }
    var bg = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(174, 213, 129, 0.2)',
        'rgba(67, 160, 71, 0.2)',
        'rgba(121, 134, 203, 0.2)',
        'rgba(173, 20, 87, 0.2)',
        'rgba(239, 83, 80, 0.2)',
        'rgba(255, 171, 145, 0.2)'
    ];

    var bo = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(174, 213, 129, 1)',
        'rgba(67, 160, 71, 1)',
        'rgba(121, 134, 203, 1)',
        'rgba(173, 20, 87, 1)',
        'rgba(239, 83, 80, 1)',
        'rgba(255, 171, 145, 1)'
    ];

    for (var i = 0; i < locations.length; i++) {
        var temp = {
            label: locations[i],
            data: [],
            backgroundColor: bg[i],
            borderColor: bo[i]
        };
        for (var j = 0; j < resp.length; j++) {
            if (resp[j].Location == locations[i]) {
                var s = '';
                var d = new Date(resp[j].Date);
                s += d.toLocaleString('default', { month: 'short' });
                s += ` ${d.getFullYear()}`;
                temp.data.push({ x: s, y: resp[j].UnitsConsumed });
            }
        }
        dse.push(temp);
    }
    canvasSet(labels, dse);
}

var initChart = () => {
    var ctx = document.getElementsByClassName('chart-canvas')[0].getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: '',
            datasets: []
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
}

var canvasSet = (l, d) => {
    myChart.data.labels = l;
    myChart.data.datasets = d;
    myChart.update();
    $('.canvas-placeholder').hide();
    $('.chart-canvas').show();
}