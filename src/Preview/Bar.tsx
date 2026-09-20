type BarProps = {
    label: string;
    value: number;
    color: string;
    height: number;
    depth?: number;
    isLeader?: boolean;
};

export const Bar = ({ label, value, color, height, depth = 8, isLeader = false, }: BarProps) => (
    <div className={` mx-3 flex flex-col items-center transition-all duration-[3000ms] ease-in-out`} >
        <div className="relative w-10 transition-[height] duration-[3000ms] ease-in-out" style={{ height, marginTop: depth, marginRight: depth, }} >
            <div className="ml-2 mb-2 absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap text-sm font-bold text-white transition-all duration-[3000ms] ease-out " >
                {value}
            </div>
            <div className={` absolute bottom-full left-0 w-full origin-bottom-left skew-x-[-45deg]`} style={{backgroundColor: color, height: depth, filter: "brightness(1.3)", }} />
            <div className={` absolute left-full top-0 h-full origin-left skew-y-[-45deg]`} style={{backgroundColor: color, width: depth, filter: "brightness(0.65)", }} />
            <div className={` absolute inset-0 `} style={{backgroundColor: color}}/>
        </div>
        <div className={`text-lg whitespace-nowrap transition-all duration-500 `} >
            {label}
        </div>
    </div>
);
