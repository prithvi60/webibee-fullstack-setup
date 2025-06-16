'use client'
import React from 'react'
import ApexChart from "./ApexCharts";


const TopMetricsCards = () => {
    const series = [4315, 1236, 327, 152000, 4.7];
    const labels = ['TotalUsers', 'ActiveUsersThisWeek', 'NewSignupsThisMonth', 'RevenueINR', 'ConversionRate'];

    const options = {
        chart: {
            width: 480,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                },
            },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 500,
            },
        },
        labels: labels,
        title: {
            text: "Monthly Growth",
            align: "center" as "center",
            style: {
                fontSize: "18px",
                fontWeight: "bold",
                color: "#263238",
            },
        },
        colors: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6B7280', '#FF8C8C'],
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '25%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                },
            }
        },
        legend: {
            show: true,
            floating: true,
            fontSize: '14px',
            position: 'left' as 'left',
            offsetX: 45,
            offsetY: 30,
            labels: {
                useSeriesColors: true,
            },
            markers: {
                size: 0
            },
            formatter: function (seriesName: string, opts: any) {
                return seriesName + ": " + opts.w.globals.series[opts.seriesIndex];
            },
            itemMargin: {
                vertical: 3
            }
        },
        responsive: [
            {
                breakpoint: 1024,
                options: {
                    legend: {
                        offsetX: 0,
                        offsetY: 20,
                        fontSize: '13px'
                    }
                }
            },
            {
                breakpoint: 768,
                options: {
                    legend: {
                        offsetX: -20,
                        offsetY: 20,
                        fontSize: '13px'
                    }
                }
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%",
                    },
                    title: {
                        align: "left" as "left",
                        style: {
                            fontSize: "16px",
                        },
                    },
                    legend: {
                        offsetX: -10,
                        offsetY: 15,
                        fontSize: '12px'
                    }
                },
            },
        ],
    };
    return (
        <div className="w-full h-full">
            <ApexChart
                type="radialBar"
                series={series}
                options={options}
                height={350}
                width="100%"
            />
        </div>
    )
}

export default TopMetricsCards