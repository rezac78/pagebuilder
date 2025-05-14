import { useState } from "react"

export default function RichBlock({ data, onChange }) {
    const [elements, setElements] = useState(data.elements || [])

    const handleChange = (id, key, value) => {
        const updated = elements.map((el) =>
            el.id === id ? { ...el, [key]: value } : el
        )
        setElements(updated)
        onChange(updated)
    }

    const addElement = (type) => {
        const newEl = {
            id: Date.now().toString(),
            type,
            text: "محتوای جدید",
            ...(type === "heading" ? { level: "h2", align: "left" } : {}),
            ...(type === "button" ? { link: "#" } : {}),
            ...(type === "link" ? { href: "#" } : {}),
        }
        const updated = [...elements, newEl]
        setElements(updated)
        onChange(updated)
    }

    return (
        <div className="space-y-4 border p-4 rounded bg-white shadow">
            {elements.map((el) => {
                switch (el.type) {
                    case "heading":
                        { const Tag = el.level || "h2"
                        return (
                            <div key={el.id}>
                                <Tag className={`text-${el.align} text-xl font-bold`}>
                                    <input
                                        className="w-full font-bold"
                                        value={el.text}
                                        onChange={(e) => handleChange(el.id, "text", e.target.value)}
                                    />
                                </Tag>
                            </div>
                        ) }
                    case "paragraph":
                        return (
                            <textarea
                                key={el.id}
                                className="w-full text-base border p-2 rounded"
                                value={el.text}
                                onChange={(e) => handleChange(el.id, "text", e.target.value)}
                            />
                        )
                    case "button":
                        return (
                            <div key={el.id}>
                                <input
                                    value={el.text}
                                    className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                                    onChange={(e) => handleChange(el.id, "text", e.target.value)}
                                />
                            </div>
                        )
                    case "link":
                        return (
                            <div key={el.id}>
                                <input
                                    value={el.text}
                                    className="text-blue-600 underline"
                                    onChange={(e) => handleChange(el.id, "text", e.target.value)}
                                />
                            </div>
                        )
                    case "tag":
                        return (
                            <div key={el.id}>
                                <input
                                    value={el.text}
                                    className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                                    onChange={(e) => handleChange(el.id, "text", e.target.value)}
                                />
                            </div>
                        )
                    default:
                        return null
                }
            })}

            <div className="flex flex-wrap gap-2 mt-4">
                {["heading", "paragraph", "button", "tag", "link"].map((type) => (
                    <button
                        key={type}
                        onClick={() => addElement(type)}
                        className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                        ➕ {type}
                    </button>
                ))}
            </div>
        </div>
    )
}
