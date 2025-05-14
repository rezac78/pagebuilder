import Sidebar from "./components/Sidebar"
import Canvas from "./components/Canvas"
import "./index.css"
import { useState } from "react";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex font-sans ">
      <DndProvider backend={HTML5Backend}>
        <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} />
        <Canvas isOpen={isOpen} />
      </DndProvider>
    </div>
  )
}

export default App
