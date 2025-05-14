import React from "react";

export default function TextBlock({ data }) {
    const alignment = data?.align || "left";
    let alignClass = "text-left";
    if (alignment === "center") alignClass = "text-center";
    else if (alignment === "right") alignClass = "text-right";

    return (
        <div className={`${alignClass}`}>
            <p className="text-base sm:text-lg leading-relaxed">{data.text}</p>
        </div>
    );
}
