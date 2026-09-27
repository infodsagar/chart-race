import { useEffect, useState } from "react";

interface OdometerNumberProps {
    value: number;
    duration?: number;
}

const DIGIT_HEIGHT = 24;

const Digit = ({
    digit,
    duration,
}: {
    digit: number;
    duration: number;
}) => {
    const [current, setCurrent] = useState(digit);
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        if (digit === current) return;

        setRolling(true);

        const timer = setTimeout(() => {
            setCurrent(digit);
            setRolling(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [digit, current, duration]);

    return (
        <div
            className="relative overflow-hidden"
            style={{
                height: DIGIT_HEIGHT,
                width: "0.65em",
            }}
        >
            <div
                className="absolute left-0 top-0 flex flex-col"
                style={{
                    transform: rolling
                        ? `translateY(-${DIGIT_HEIGHT}px)`
                        : "translateY(0)",
                    transition: rolling
                        ? `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`
                        : "none",
                }}
            >
                {/* Current */}
                <div
                    className="flex items-center justify-center"
                    style={{ height: DIGIT_HEIGHT }}
                >
                    {current}
                </div>

                {/* Next */}
                <div
                    className="flex items-center justify-center"
                    style={{ height: DIGIT_HEIGHT }}
                >
                    {digit}
                </div>
            </div>
        </div>
    );
};

export const OdometerNumber = ({
    value,
    duration = 600,
}: OdometerNumberProps) => {
    const digits = String(value).split("");

    return (
        <div className="flex items-center justify-center">
            {digits.map((digit, index) => {
                if (digit === "-") {
                    return <span key={index}>-</span>;
                }

                return (
                    <Digit
                        key={index}
                        digit={Number(digit)}
                        duration={duration}
                    />
                );
            })}
        </div>
    );
};
