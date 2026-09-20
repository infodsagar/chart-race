import { useState } from "react";
import { Sidebar } from "./components/Sidebar"
import { PreviewCanvas } from "./Preview/PreviewCanvas"
import type { ChartRow } from "./class/ChartRow";


export type ChartType = "bar" | "line";

export const App = () => {
    const [chartRowData, setChartRowData] = useState<ChartRow[]>([]);
    const [chartType, setChartType] = useState<ChartType>("bar");

    return(
        <div className="h-full flex">
            <Sidebar onDataLoaded={setChartRowData} onChartTypeChange={setChartType}/>
            <PreviewCanvas data={chartRowData}/>
        </div>
    )
}