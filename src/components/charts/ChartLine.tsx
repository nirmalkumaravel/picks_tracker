import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { format, parseISO } from "date-fns";

export default function ChartLine({
  data, xKey, yKey, yDomain, color
}:{
  data:any[]; xKey:string; yKey:string; yDomain:[number,number]; color:string;
}){
  return (
    <div style={{width:"100%", height:300}}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
              <stop offset="100%" stopColor={color} stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" />
          <XAxis dataKey={xKey} tickFormatter={(d)=>format(parseISO(d), "MMM d")} />
          <YAxis domain={yDomain} />
          <Tooltip formatter={(v)=>Number(v as number).toFixed(2)} labelFormatter={(l)=>format(parseISO(l as string),"PP")} />
          <Legend />
          <Line type="monotone" dataKey={yKey} stroke="url(#gradLine)" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
