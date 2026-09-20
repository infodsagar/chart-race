import { useEffect, useState } from "react";

interface TimelineProps {
    value: number;
}

const HEIGHT = 64;

export const Timeline = ({ value }: TimelineProps) => {
    const [current, setCurrent] = useState(value);
    const [next, setNext] = useState<number | null>(null);
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        if (value === current) return;

        setNext(value);
        setRolling(true);

        const timer = setTimeout(() => {
            setCurrent(value);
            setNext(null);
            setRolling(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div
            className="absolute top-4 left-4 overflow-hidden"
            style={{
                width: 140,
                height: HEIGHT,
            }}
        >
            <div
                className="relative w-full"
                style={{
                    height: HEIGHT * 2,
                    transform: rolling
                        ? `translateY(${HEIGHT}px)`
                        : "translateY(0)",
                    transition: rolling
                        ? "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)"
                        : "none",
                }}
            >
                {/* NEXT YEAR - ABOVE */}
                <div
                    className="
                        absolute
                        left-0
                        top-[-64px]
                        flex
                        h-16
                        w-full
                        items-center
                        text-4xl
                        font-bold
                        text-white
                    "
                >
                    {next ?? current}
                </div>

                {/* CURRENT YEAR */}
                <div
                    className="
                        absolute
                        left-0
                        top-0
                        flex
                        h-16
                        w-full
                        items-center
                        text-4xl
                        font-bold
                        text-white
                    "
                >
                    {current}
                </div>
            </div>
        </div>
    );
};
