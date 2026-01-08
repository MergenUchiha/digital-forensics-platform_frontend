import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface ThreatData {
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

interface ThreatChartProps {
  data: ThreatData[];
}

export const ThreatChart = ({ data }: ThreatChartProps) => {
  const { theme } = useTheme();
  
  // Цвета для графика в зависимости от темы
  const chartColors = {
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
    axis: theme === 'dark' ? '#9CA3AF' : '#6b7280',
    bar: '#00d9ff',
    tooltipBg: theme === 'dark' ? '#1F2937' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#374151' : '#e5e7eb',
    tooltipText: theme === 'dark' ? '#F3F4F6' : '#1a202c',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Threat Types</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis 
              dataKey="name" 
              stroke={chartColors.axis} 
              tick={{ fill: chartColors.axis }}
            />
            <YAxis 
              stroke={chartColors.axis} 
              tick={{ fill: chartColors.axis }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: chartColors.tooltipBg,
                border: `1px solid ${chartColors.tooltipBorder}`,
                borderRadius: '8px',
                color: chartColors.tooltipText,
              }}
              cursor={{ fill: theme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.3)' }}
            />
            <Bar 
              dataKey="count" 
              fill={chartColors.bar} 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};