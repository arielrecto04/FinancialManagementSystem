import React from 'react';
import ReactApexChart from 'react-apexcharts';

const StackedBarChart = ({ title, categories, series }) => {
    const options = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: categories,
        },
        title: {
            text: title,
            align: 'center',
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
            }
        },
        legend: {
            position: 'top'
        },
        fill: {
            opacity: 1
        }
    };

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
        />
    );
};

export default StackedBarChart; 