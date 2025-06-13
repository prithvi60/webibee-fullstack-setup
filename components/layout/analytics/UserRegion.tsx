import React from 'react'
import ApexChart from './ApexCharts';

const UserRegion = () => {
    const series = [
        {
            name: 'Users',
            data: [1560, 980, 430, 320],
        },
    ];

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
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        colors: ['#F59E0B'],
        xaxis: {
            categories: ['India', 'United States', 'UAE', 'Germany'],
            title: {
                text: 'Number of Users',
            },
        },
        yaxis: {
            title: {
                text: 'Country',
            },
        },
        title: {
            text: 'Users by Region',
            align: 'center' as 'center',
        },
        tooltip: {
            theme: 'dark',
        },
    };
    return (
        <div className="w-full h-full">
            <ApexChart
                type="bar"
                series={series}
                options={options}
                height={350}
                width="100%"
            />
        </div>
    );
}

export default UserRegion