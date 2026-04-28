import { useRef } from 'react'; // Add this import

// pin input
function PinInput({
    value,
    onChange,
    show,
}: {
    value: string;
    onChange: (val: string) => void;
    show?: boolean;
}) {
    const inputs = useRef<(HTMLInputElement | null)[]>([]); // Updated type

    const handleChange = (index: number, val: string) => {
        if (!/^\d?$/.test(val)) return;

        const next = value.split("");
        next[index] = val;
        const newValue = next.join("").slice(0, 4);

        onChange(newValue);

        if (val && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
                <input
                    key={i}
                    ref={(el) => {
                        inputs.current[i] = el; // Fixed: just assign, don't return
                    }}
                    type={show ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] ?? ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="
                        h-12 w-12
                        rounded-lg
                        border border-gray-300
                        text-center text-lg
                        focus:outline-none focus:ring-2 focus:ring-black
                    "
                />
            ))}
        </div>
    );
}
export { PinInput }