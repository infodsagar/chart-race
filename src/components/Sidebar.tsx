import { useState, type ChangeEvent } from "react";
import {notification, Select} from 'antd';
import type { ChartRow } from "../class/ChartRow";


type NotificationType = 'success' | 'info' | 'warning' | 'error';
type ChartType = "bar" | "line";


interface SidebarProps {
    onDataLoaded: (data: ChartRow[]) => void;
    onChartTypeChange: (type: ChartType) => void;
}

export const Sidebar = ({ onDataLoaded, onChartTypeChange }: SidebarProps) => {
    const [api] = notification.useNotification();
    const [chartType, setChartType] = useState<ChartType>("bar");


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

            console.log("JSON data:", rows);

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
        <div className="p-2 bg-gray-200 min-w-80">
            <label htmlFor="json-upload"
                className="px-3 py-2 min-w-32 inline-flex items-center  border rounded bg-green-300 hover:bg-green-400 cursor-pointer transition" >
                Upload Json
            </label>
            <input id="json-upload" type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
            <div className="mt-4 flex items-center">
                <label className="mr-2 text-sm font-medium"> Chart type </label>

                <Select value={chartType} onChange={handleChartTypeChange} className="w-40" 
                    options={[ { label: "Bar", value: "bar", }, { label: "Line", value: "line", }, ]} />
            </div>
        </div>
    );
};
