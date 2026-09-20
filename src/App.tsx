import { useState } from "react";
import { Sidebar } from "./components/Sidebar"
import { PreviewCanvas } from "./Preview/PreviewCanvas"

type ExcelRow = Record<string, string | number | boolean | null>;

export type ChartType = "bar" | "line";

export const App = () => {
    const [excelData, setExcelData] = useState<ExcelRow[]>([]);
    const [chartType, setChartType] = useState<ChartType>("bar");

    return(
        <div className="p-2 flex justify-between">
            <Sidebar onDataLoaded={setExcelData} onChartTypeChange={setChartType}/>
            <PreviewCanvas data={excelData} chartType={chartType}/>
        </div>
    )
}