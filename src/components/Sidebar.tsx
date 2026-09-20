import ExcelJS from "exceljs";
import { useState, type ChangeEvent } from "react";
import {notification, Select} from 'antd';


type ExcelRow = Record<string, string | number | boolean | null>;

type NotificationType = 'success' | 'info' | 'warning' | 'error';

type ExcelValue = string | number | boolean | null;

type ChartType = "bar" | "line";

const getCellValue = ( value: ExcelJS.CellValue ): string | number | boolean | null => {
    if (value == null) return null;

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === "object" && "result" in value) {
        const result = value.result;

        if (
            typeof result === "string" ||
            typeof result === "number" ||
            typeof result === "boolean"
        ) {
            return result;
        }

        return null;
    }

    return null;
};

interface SidebarProps {
    onDataLoaded: (data: ExcelRow[]) => void;
    onChartTypeChange: (type: ChartType) => void;
}

export const Sidebar = ({ onDataLoaded, onChartTypeChange }: SidebarProps) => {
    const [api] = notification.useNotification();
    const [chartType, setChartType] = useState<ChartType>("bar");


    const handleChartTypeChange = (value: ChartType) => {
        setChartType(value);
        onChartTypeChange(value);
    };

    const openNotificationWithIcon = (type: NotificationType, message: string) => { api[type]({
        title: 'Notification Title',
        description:
            message,
        });
    };

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            const buffer = await file.arrayBuffer();

            const workbook = new ExcelJS.Workbook();

            await workbook.xlsx.load(buffer);

            const worksheet = workbook.worksheets[0];

            if (!worksheet) {
                openNotificationWithIcon('warning', 'No worksheet found');
            }

            const headerRow = worksheet.getRow(1);

            const headers: string[] = [];

            headerRow.eachCell((cell, columnNumber) => {
                headers[columnNumber] = String(cell.value ?? "");
            });

            const rows: Record<string, ExcelValue>[] = [];

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowData: Record<string, ExcelValue> = {};

                row.eachCell((cell, columnNumber) => {
                    const header = headers[columnNumber];

                    if (!header) return;

                    rowData[header] = getCellValue(cell.value);
                });

                rows.push(rowData);
            });

            console.log("Excel data:", rows);

            onDataLoaded(rows);
        } catch (error) {
            console.error("Failed to read Excel file:", error);
        } finally {
            // Allows the user to upload the same file again
            event.target.value = "";
        }
    };

    return (
        <div className="mx-2">
            <label htmlFor="excel-upload"
                className="px-3 py-2 min-w-32 inline-flex items-center  border rounded bg-green-300 hover:bg-green-400 cursor-pointer transition" >
                Upload Excel
            </label>
            <input id="excel-upload" type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            <div className="mt-4 flex items-center">
                <label className="mr-2 text-sm font-medium"> Chart type </label>

                <Select value={chartType} onChange={handleChartTypeChange} className="w-40" 
                    options={[ { label: "Bar", value: "bar", }, { label: "Line", value: "line", }, ]} />
            </div>
        </div>
    );
};
