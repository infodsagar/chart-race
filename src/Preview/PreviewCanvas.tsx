import { Bar, Line } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip, PointElement, LineElement, type ChartData, type ChartOptions, } from "chart.js";
import { useEffect, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";


ChartJS.register( CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartDataLabels, Title, Tooltip, Legend );

type ChartType = "bar" | "line";

type ExcelRow = Record<string, string | number | boolean | null>;

interface PreviewCanvasProps {
    data: ExcelRow[];
    chartType: ChartType;
}

export const PreviewCanvas = ({ data, chartType }: PreviewCanvasProps)=> {
    const [yearIndex, setYearIndex] = useState(0);
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const labelColumn = columns[0];
    const currentRow = data[yearIndex];
    const valueColumns = columns.slice(1);
    const yearColumn = columns[0];

    const sortedColumns = [...valueColumns].sort(
        (a, b) =>
            Number(currentRow[b] ?? 0) -
            Number(currentRow[a] ?? 0)
    );


    const barData: ChartData<"bar"> = {
        labels: sortedColumns,
        datasets: sortedColumns.map((column) => {
            const originalIndex = valueColumns.indexOf(column);
            const value = Number(currentRow[column] ?? 0);

            const isLeader = column === sortedColumns[0];

            return {
                label: column,

                data: sortedColumns.map((label) =>
                    label === column ? value : 0
                ),

                backgroundColor: isLeader
                    ? "#facc15"
                    : [
                        "#ef4444",
                        "#3b82f6",
                        "#22c55e",
                        "#a855f7",
                        "#f97316",
                        "#06b6d4",
                    ][originalIndex % 6],

                borderRadius: 6,
                borderWidth: 1,

                barPercentage: isLeader ? 0.9 : 0.75,
                categoryPercentage: 0.8,
            };
        }),
    };


    const lineData: ChartData<"line"> = {
        labels: data.map((row) => String(row[labelColumn] ?? "")),
        datasets: valueColumns.map((column, index) => ({
            label: column,
            data: data.map((row) => Number(row[column] ?? 0) ),
            backgroundColor: [
                "#ef4444",
                "#3b82f6",
                "#22c55e",
                "#eab308",
                "#a855f7",
                "#f97316",
            ][index % 6],
        })),
    };


    const lineOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, }, },
        plugins: { legend: { position: "top", }, tooltip: { mode: "index", intersect: false, }, },
    };


    const barOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: "easeInOutQuart", },
        plugins: {
            legend: { display: false, },
            tooltip: {enabled: false},
            title: { display: true, text: "Company Growth", },
            datalabels: {color: "#ffffff", anchor: "end", align: "top", offset: 6, font: { size: 24, weight: "bold", }, formatter: (value) => value, },
        },
        scales: {
            x: { grid: { display: false, }, ticks: { font: {size: 24 }} },
            y: { beginAtZero: true, display: false },
        },
    };

    useEffect(() => {
        if(data.length === 0){
            return;
        }
        setYearIndex(0);
    }, [data]);


    useEffect(() => {
        if (data.length <= 1) return;

        const timer = setTimeout(() => {
            setYearIndex((current) => {
                if (current >= data.length - 1) {
                    return 0;
                }

                return current + 1;
            });
        }, 3500);

        return () => clearTimeout(timer);
    }, [yearIndex, data.length]);


    return(
        <>{
            data.length === 0 ? <div>No Data</div> : 
            <div className="mx-2 max-w-[1080px] max-h-[1920px] bg-black">
                {chartType === "bar" ? 
                    <div className="h-200 w-100">
                        <Bar data={barData} options={barOptions}/>
                        <div className="mt-4 flex justify-center">
                            <span className="text-4xl font-bold text-gray-700">
                                {String(currentRow[yearColumn])}
                            </span>
                        </div>
                    </div> :
                    <Line data={lineData} options={lineOptions} />
                }
            </div>
        }</>
    )
}