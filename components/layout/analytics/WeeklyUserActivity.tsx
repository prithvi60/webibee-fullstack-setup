import React from 'react'
import ApexChart from './ApexCharts';

const WeeklyUserActivity = () => {
    const series = [{
        name: "weekly activity",
        data: [120, 200, 180, 220, 240, 160, 116]
    }];
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
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 500,
            },
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 8,
                left: 7,
                blur: 10,
                opacity: 0.5
            },
        },
        labels: ['Mon', "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        title: {
            text: 'Weekly User Activity',
            align: "center" as "center",
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#263238'
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: '100%'
                    },
                    legend: {
                        position: "top",
                        horizontalAlign: "center"
                    },
                    title: {
                        align: "left" as "left",
                        style: {
                            fontSize: '16px',
                        },
                    },
                }
            }
        ]
    };
    return (
        <div className="w-full h-full" >
            <ApexChart
                type="area"
                series={series}
                options={options}
                height={350}
                width="100%"
            />
        </div >
    )
}

export default WeeklyUserActivity