import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const tooltipStyle = {
  contentStyle: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: 8,
    fontSize: 13,
    color: '#e6edf3',
  },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
};

const axisStyle = { fill: '#8b949e', fontSize: 12 };

// Bar chart — attendance % per student
export function AttendanceBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ bottom: 30 }}>
        <XAxis
          dataKey="name"
          tick={axisStyle}
          angle={-30}
          textAnchor="end"
        />
        <YAxis domain={[0, 100]} tick={axisStyle} unit="%" />
        <Tooltip
          {...tooltipStyle}
          formatter={v => [v + '%', 'Attendance']}
        />
        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.percentage < 75 ? '#f85149' : '#3fb950'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Line chart — attendance trend over time
export function AttendanceTrendChart({ data, height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={axisStyle} />
        <YAxis domain={[0, 100]} tick={axisStyle} unit="%" />
        <Tooltip
          {...tooltipStyle}
          formatter={v => [v + '%', 'Present']}
        />
        <Line
          type="monotone"
          dataKey="present_pct"
          stroke="#3fb950"
          strokeWidth={2}
          dot={{ fill: '#3fb950', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#3fb950' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Step chart — individual student present/absent per session
export function StudentTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ ...axisStyle, fontSize: 11 }} />
        <YAxis
          domain={[0, 1]}
          tickFormatter={v => v === 1 ? 'P' : 'A'}
          tick={{ ...axisStyle, fontSize: 11 }}
        />
        <Tooltip
          {...tooltipStyle}
          formatter={v => [v === 1 ? 'Present' : 'Absent']}
        />
        <Line
          type="stepAfter"
          dataKey="status"
          stroke="#3fb950"
          strokeWidth={2}
          dot={{ r: 3, fill: '#3fb950', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
