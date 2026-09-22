import { useState, type ChangeEvent } from "react";
import {notification, Select} from 'antd';
import type { ChartRow } from "../class/ChartRow";


type NotificationType = 'success' | 'info' | 'warning' | 'error';
type ChartType = "bar" | "line";


interface SidebarProps {
    onDataLoaded: (data: ChartRow[]) => void;
    onChartTypeChange: (type: ChartType) => void;
    yearAnimationDuration: number;
    setYearAnimationDuration: React.Dispatch<React.SetStateAction<number>>;
    barAnimationDuration: number;
    setBarAnimationDuration: React.Dispatch<React.SetStateAction<number>>;
}

export const Sidebar = ({ onDataLoaded, onChartTypeChange, yearAnimationDuration, setYearAnimationDuration, barAnimationDuration, setBarAnimationDuration }: SidebarProps) => {
    const [api] = notification.useNotification();
    const [chartType, setChartType] = useState<ChartType>("bar");

    const handleYearAnimationDuration = (e: ChangeEvent<HTMLInputElement>) => {
        if(Number(e.target.value) < barAnimationDuration){
            setBarAnimationDuration(Number(e.target.value) - 0.5);
            setYearAnimationDuration(Number(e.target.value));
            return;
        }
        if(Number(e.target.value) < 1.5){
            setYearAnimationDuration(1.5);
            return;
        }
        setYearAnimationDuration(Number(e.target.value));
    }

    const handleBarAnimationDuration = (e: ChangeEvent<HTMLInputElement>) => {
        if(Number(e.target.value) > yearAnimationDuration){
            setYearAnimationDuration(Number(e.target.value) + 0.5);
            setBarAnimationDuration(Number(e.target.value));
            return;
        }
        if(Number(e.target.value) < 1){
            setBarAnimationDuration(1);
            return;
        }
        setBarAnimationDuration(Number(e.target.value));
    }

    const handleChartTypeChange = (value: ChartType) => {
        setChartType(value);
        onChartTypeChange(value);
    };

    const openNotificationWithIcon = (type: NotificationType, message: string) => { 
        api[type]({ title: 'Notification Title', description: message, });
    };

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement> ) => {
        const file = event.target.files?.[0];
        if (!file){
            return;
        }
        try {
            const text = await file.text();

            const json: unknown = JSON.parse(text);

            if (!Array.isArray(json)) {
                throw new Error( "JSON must contain an array." );
            }

            const rows: ChartRow[] = json.map((item, index) => {
                if (typeof item !== "object" || item === null ) {
                    throw new Error(`Row ${index + 1} is invalid.`);
                }

                const row = item as Record<string, unknown>;

                if (typeof row.header !== "string" || typeof row.timeline !== "number" 
                    || typeof row.value !== "number" || typeof row.color !== "string") {
                    throw new Error( `Row ${ index + 1 } must contain header, timeline, and value.` );
                }

                return {
                    header: row.header,
                    timeline: row.timeline,
                    value: row.value,
                    color: row.color
                };
            });

            if (rows.length === 0) {
                throw new Error( "JSON file contains no data." );
            }

            onDataLoaded(rows);

            openNotificationWithIcon( "success", `Loaded ${rows.length} data points.` );
        } catch (error) {
            console.error( "Failed to read JSON file:", error );
            openNotificationWithIcon( "error", error instanceof Error ? error.message : "Failed to read JSON file." );
        } finally {
            event.target.value = "";
        }
    };


    return (
        <div className="p-2 flex flex-col bg-gray-200 min-w-90">
            <div className="mt-4 flex items-center">
                <label className="mr-2 text-sm font-medium min-w-22"> Chart type </label>
                <Select value={chartType} onChange={handleChartTypeChange} className="w-full" 
                    options={[ { label: "Bar", value: "bar", }, { label: "Line", value: "line", }, ]} />
            </div>
            <div className="mt-4 flex">
                <label htmlFor="" className="mr-2 min-w-46">Year Animation Duration</label>
                <input name="yearAnimationDuration" value={yearAnimationDuration} onChange={(e) => handleYearAnimationDuration(e)} type="number" className="px-2 py-1 max-w-22 border bg-white rounded-md" placeholder="seconds"/>
            </div>
            <div className="mt-4 flex">
                <label htmlFor="" className="mr-2 min-w-46">Bar Animation Duration</label>
                <input name="barAnimationDuration" value={barAnimationDuration} onChange={(e) => handleBarAnimationDuration(e)} type="number" className="px-2 py-1 max-w-22 border bg-white rounded-md" placeholder="seconds"/>
            </div>
            <div className="mt-6 self-center">
                <label htmlFor="json-upload" className="px-6 py-2 border rounded-md bg-green-300 cursor-pointer hover:bg-green-400" > Upload Json </label>
                <input id="json-upload" type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
            </div>
        </div>
    );
};
