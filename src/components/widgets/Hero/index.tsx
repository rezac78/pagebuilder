import React from "react";

export default function Hero({data}) {
 return (
  <div className="bg-blue-500 text-white text-center p-8 rounded">
   <h1 className="text-3xl font-bold">{data.text}</h1>
  </div>
 );
}
