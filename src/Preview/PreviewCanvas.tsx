import { useEffect, useMemo, useState } from "react";
import type { ChartRow } from "../class/ChartRow";
import { Bar } from "./Bar"
import { Timeline } from "./Timeline";

interface PreviewCanvasProps {
    data: ChartRow[];
}

const COLORS = [
    "bg-red-300",  
    "bg-blue-300", 
    "bg-green-300",
    "bg-yellow-300",
    "bg-purple-300",
    "bg-orange-300",
];

export const PreviewCanvas = ({data}: PreviewCanvasProps)=> {
    const [timelineIndex, setTimelineIndex] = useState<number>(0);

    const timelines = useMemo(() => {
        return [...new Set(data.map((row) => row.timeline))]
            .sort((a, b) => a - b);
    }, [data]);


    useEffect(() => {
        setTimelineIndex(0);
    }, [data]);


    useEffect(() => {
        if (timelines.length <= 1) {
            return;
        }

        const timer = setTimeout(() => {
            setTimelineIndex((current) => {
                if (current >= timelines.length - 1) {
                    return 0;
                }

                return current + 1;
            });
        }, 3500);

        return () => clearTimeout(timer);
    }, [timelineIndex, timelines.length]);

    const currentTimeline = timelines[timelineIndex];

    const currentRows = useMemo(() => {
        return data.filter( (row) => row.timeline === currentTimeline )
            .sort((a, b) => b.value - a.value);
    }, [data, currentTimeline]);

    const maxValue = useMemo(() => {
        return Math.max( ...currentRows.map((row) => row.value), 1 );
    }, [currentRows]);

    const colorMap = useMemo(() => {
        const map = new Map<string, string>();

        const names = [
            ...new Set(
                data.map((row) => row.header)
            ),
        ];

        names.forEach((name, index) => {
            map.set(
                name,
                COLORS[index % COLORS.length]
            );
        });

        return map;
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="p-2 mx-1 w-full bg-gray-200">
                <div className="bg-black min-w-90 min-h-160 flex items-center justify-center">
                    <span className="text-white">
                        Upload a JSON file
                    </span>
                </div>
            </div>
        );
    }

    
    return (
        <div className="p-2 mx-1 w-full bg-gray-200 text-white">
            <div className="relative bg-black min-w-90 min-h-160 max-w-90 max-h-160 overflow-hidden">
                <Timeline value={currentTimeline} />
                <div className="mb-4 absolute bottom-0 left-0 right-0 h-[85%] flex items-end justify-center">
                    {currentRows.map((row, index) => { 
                            const height = (row.value / maxValue) * 300;

                            return (
                                <Bar key={row.header} label={row.header} value={row.value} color={ row.color } height={height} isLeader={index === 0} />
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    )
}