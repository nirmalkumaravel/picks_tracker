import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ChartBarCounts({ counts, yDomain }:{ counts:Record<string,number>; yDomain:[number,number]; }){
  const data = ["Win","Loss","Push","Pending"].map(name => ({ name, value: counts[name] || 0 }));
  return (
    <div style={{width:"100%", height:280}}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis domain={yDomain} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Count" fill="#22C55E" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
