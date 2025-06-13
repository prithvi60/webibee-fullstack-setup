import React from "react";
import ApexChart from "./ApexCharts";

const TrafficSources = () => {
    const series = [45, 30, 15, 10, 5];
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
                color: "#000",
                top: 8,
                left: 7,
                blur: 10,
                opacity: 0.5,
            },
        },
        dataLabels: {
            enabled: true,
        },
        labels: [
            "Organic Search",
            "Direct Traffic",
            "Social Media",
            "Referral",
            "Email",
        ],
        title: {
            text: "Traffic Sources Breakdown",
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
                        position: "bottom",
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
                type="pie"
                series={series}
                options={options}
                height={350}
                width="100%"
            />
        </div>
    );
};

export default TrafficSources;
