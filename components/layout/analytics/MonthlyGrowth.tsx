import React from "react";
import ApexChart from "./ApexCharts";

const MonthlyGrowth = () => {
    const series = [
        {
            name: "monthly growth",
            data: [300, 420, 510, 620, 740, 810],
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
            dropShadow: {
                enabled: true,
                color: "#293956",
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            title: {
                text: "Number of Months"
            }
        },
        yaxis: {
            title: {
                text: 'Growth',
            },
        },
        title: {
            text: "Monthly Growth",
            align: "center" as "center",
            style: {
                fontSize: "18px",
                fontWeight: "bold",
                color: "#263238",
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%",
                    },
                    legend: {
                        position: "top",
                        horizontalAlign: "center",
                    },
                    title: {
                        align: "left" as "left",
                        style: {
                            fontSize: "16px",
                        },
                    },
                },
            },
        ],
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
};

export default MonthlyGrowth;
