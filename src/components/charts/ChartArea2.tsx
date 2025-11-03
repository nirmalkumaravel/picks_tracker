import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format, parseISO } from "date-fns";

export default function ChartArea2({ data, xKey, y1Key, y2Key, yDomain, color1, color2 }:{
  data:any[]; xKey:string; y1Key:string; y2Key:string; yDomain:[number,number]; color1:string; color2:string;
}){
  return (
    <div style={{width:"100%", height:300}}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color1} stopOpacity={0.35}/>
              <stop offset="100%" stopColor={color1} stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color2} stopOpacity={0.35}/>
              <stop offset="100%" stopColor={color2} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="#e2e8f0" />
          <XAxis dataKey={xKey} tickFormatter={(d)=>format(parseISO(d), "MMM d")} />
          <YAxis domain={yDomain} />
          <Tooltip formatter={(v)=>Number(v as number).toFixed(2)} labelFormatter={(l)=>format(parseISO(l as string),"PP")} />
          <Legend />
          <Area type="monotone" dataKey={y1Key} stroke={color1} fill="url(#g1)" strokeWidth={2} />
          <Area type="monotone" dataKey={y2Key} stroke={color2} fill="url(#g2)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
