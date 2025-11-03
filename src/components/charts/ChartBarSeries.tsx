import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ChartBarSeries({ rows, xKey, yKey, yDomain, color, label, fmt }:{
  rows:any[]; xKey:string; yKey:string; yDomain:[number,number]; color:string; label?:string; fmt?:(v:number)=>string;
}){
  const data = rows.map(r => ({ label: r[xKey], value: r[yKey] }));
  return (
    <div style={{width:"100%", height:300}}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="#e2e8f0" />
          <XAxis dataKey="label" />
          <YAxis domain={yDomain} />
          <Tooltip formatter={(v)=>fmt ? fmt(v as number) : Number(v as number).toFixed(2)} />
          <Legend />
          <Bar dataKey="value" name={label || yKey} fill={color} radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
