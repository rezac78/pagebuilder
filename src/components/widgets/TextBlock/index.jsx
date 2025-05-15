import React from "react";

export default function TextBlock({ data }) {
    const {
        text = "متن پیش‌فرض",
        align = "left",
        color = "#000000",
        fontSize = "text-base",
        fontWeight = "font-normal",
        tag = "p", // مثلا h1 یا h2 یا p
    } = data;

    const Tag = tag; // داینامیک تگ مثل h1 یا p
    const alignClass =
        align === "center"
            ? "text-center"
            : align === "right"
                ? "text-right"
                : align === "justify"
                    ? "text-justify"
                    : "text-left";
    return (
        <div className={`${alignClass}`}>
            <Tag
                className={`${fontSize} ${fontWeight}`}
                style={{ color }}
            >
                {text}
            </Tag>
        </div>
    );
}

