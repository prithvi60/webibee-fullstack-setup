import React from "react";
import ApexChart from "./ApexCharts";

const FeatureUsage = () => {
    const series = [
        {
            name: "Feature Usage",
            data: [312, 490, 190, 278],
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
        xaxis: {
            categories: [
                "AI Reports",
                "Dashboard Views",
                "Custom Alerts",
                "Integrations Used",
            ],
        },
        colors: ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"],
        title: {
            text: "Feature Usage",
            align: "center" as "center",
            style: {
                fontSize: "18px",
                fontWeight: "bold",
                color: "#263238",
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: "end" as "end",
                horizontal: true,
            },
        },
        tooltip: {
            theme: "dark",
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

export default FeatureUsage;
