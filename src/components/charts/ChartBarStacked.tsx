import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ChartBarStacked({ rows }:{ rows:any[] }){
  return (
    <div style={{width:"100%", height:320}}>
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="#e2e8f0" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Win"     stackId="a" fill="#22C55E" radius={[8,8,0,0]} />
          <Bar dataKey="Loss"    stackId="a" fill="#EF4444" radius={[8,8,0,0]} />
          <Bar dataKey="Push"    stackId="a" fill="#94A3B8" radius={[8,8,0,0]} />
          <Bar dataKey="Pending" stackId="a" fill="#A3A3A3" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
