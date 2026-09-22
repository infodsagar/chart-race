import { useState } from "react";
import { Sidebar } from "./components/Sidebar"
import { PreviewCanvas } from "./Preview/PreviewCanvas"
import type { ChartRow } from "./class/ChartRow";

const data: ChartRow[] = [
    {
        "header": "Apple",
        "timeline": 2024,
        "value": 0,
        "color": "#e8e9ef"
    },
    {
        "header": "Google",
        "timeline": 2024,
        "value": 0,
        "color": "#508750"
    },
    {
        "header": "Samsung",
        "timeline": 2024,
        "value": 0,
        "color": "#7A003C"
    },
    {
        "header": "Apple",
        "timeline": 2025,
        "value": 400,
        "color": "#e8e9ef"
    },
    {
        "header": "Google",
        "timeline": 2025,
        "value": 500,
        "color": "#508750"
    },
    {
        "header": "Samsung",
        "timeline": 2025,
        "value": 300,
        "color": "#7A003C"
    },
    {
        "header": "Apple",
        "timeline": 2026,
        "value": 600,
        "color": "#e8e9ef"
    },
    {
        "header": "Google",
        "timeline": 2026,
        "value": 700,
        "color": "#508750"
    },
    {
        "header": "Samsung",
        "timeline": 2026,
        "value": 450,
        "color": "#7A003C"
    },
        {
        "header": "Apple",
        "timeline": 2027,
        "value": 630,
        "color": "#e8e9ef"
    },
    {
        "header": "Google",
        "timeline": 2027,
        "value": 750,
        "color": "#508750"
    },
    {
        "header": "Samsung",
        "timeline": 2027,
        "value": 550,
        "color": "#7A003C"
    }
];


export type ChartType = "bar" | "line";

export const App = () => {
    const [chartRowData, setChartRowData] = useState<ChartRow[]>(data);
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [yearAnimationDuration, setYearAnimationDuration] = useState<number>(2.5);
    const [barAnimationDuration, setBarAnimationDuration] = useState<number>(2);

    return(
        <div className="h-full flex">
            <Sidebar onDataLoaded={setChartRowData} onChartTypeChange={setChartType} yearAnimationDuration={yearAnimationDuration} setYearAnimationDuration={setYearAnimationDuration} barAnimationDuration={barAnimationDuration} setBarAnimationDuration={setBarAnimationDuration} />
            <PreviewCanvas data={chartRowData} yearAnimationDuration={yearAnimationDuration} barAnimationDuration={barAnimationDuration}/>
        </div>
    )
}