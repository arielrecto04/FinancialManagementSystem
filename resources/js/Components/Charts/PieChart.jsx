import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ title, series }) => {
    const options = {
        chart: {
            type: 'pie',
        },
        labels: ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Others'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
        title: {
            text: title,
            align: 'center',
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
            }
        }
    };

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={350}
        />
    );
};

export default PieChart; 