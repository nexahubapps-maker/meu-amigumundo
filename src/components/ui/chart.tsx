import { Chart, ChartBar, ChartLine, ChartPie } from "@/components/ui/chart";

export default function ChartDemo() {
  return (
    <Chart type="line">
      <ChartLine data={[10, 20, 30, 40, 50]} />
    </Chart>
  );
}