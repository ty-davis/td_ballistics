/**
 * ECharts option builders — keeps all chart configuration logic out of components.
 * Returns reactive option objects that update when resultsStore changes.
 */
import { computed } from 'vue'
import type { TrajectoryPoint } from '../types/results'

function cssVar(name: string): string {
  if (typeof window === 'undefined') return '#888'
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function useChartOptions() {
  const resultsStore = useResultsStore()

  const points = computed<TrajectoryPoint[]>(() => resultsStore.points)

  /** Trajectory drop chart (drop from zero vs distance) */
  const trajectoryChartOptions = computed(() => {
    const data = points.value.map(p => [p.distanceYards, p.dropFromZeroInches])
    return {
      backgroundColor: 'transparent',
      grid: { left: 60, right: 20, top: 20, bottom: 50 },
      tooltip: {
        trigger: 'axis',
        formatter: (params: unknown[]) => {
          const [p] = params as [{ data: [number, number] }]
          return `${p.data[0].toFixed(0)} yds: ${p.data[1].toFixed(1)}"`
        },
      },
      xAxis: {
        type: 'value',
        name: 'Distance (yds)',
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: { lineStyle: { color: cssVar('--color-chart-axis') } },
        splitLine: { lineStyle: { color: cssVar('--color-chart-grid'), type: 'dashed' } },
        axisLabel: { color: cssVar('--color-text-secondary') },
        nameTextStyle: { color: cssVar('--color-text-secondary') },
      },
      yAxis: {
        type: 'value',
        name: 'Drop (")',
        nameLocation: 'middle',
        nameGap: 45,
        axisLine: { lineStyle: { color: cssVar('--color-chart-axis') } },
        splitLine: { lineStyle: { color: cssVar('--color-chart-grid'), type: 'dashed' } },
        axisLabel: { color: cssVar('--color-text-secondary') },
        nameTextStyle: { color: cssVar('--color-text-secondary') },
      },
      series: [
        {
          name: 'Drop from Zero',
          type: 'line',
          data,
          smooth: true,
          lineStyle: { color: cssVar('--color-chart-trajectory'), width: 2 },
          itemStyle: { color: cssVar('--color-chart-trajectory') },
          symbol: 'none',
          markLine: {
            data: [{ yAxis: 0, name: 'Zero', lineStyle: { color: cssVar('--color-accent'), type: 'solid' } }],
            label: { color: cssVar('--color-accent') },
            symbol: ['none', 'none'],
          },
        },
      ],
    }
  })

  /** Velocity and energy dual-axis chart */
  const velocityEnergyChartOptions = computed(() => {
    const velData = points.value.map(p => [p.distanceYards, p.velocityFps])
    const energyData = points.value.map(p => [p.distanceYards, p.remainingEnergyFtLbs])
    return {
      backgroundColor: 'transparent',
      grid: { left: 65, right: 65, top: 20, bottom: 50 },
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['Velocity', 'Energy'],
        textStyle: { color: cssVar('--color-text-secondary') },
        top: 0,
      },
      xAxis: {
        type: 'value',
        name: 'Distance (yds)',
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: { lineStyle: { color: cssVar('--color-chart-axis') } },
        splitLine: { lineStyle: { color: cssVar('--color-chart-grid'), type: 'dashed' } },
        axisLabel: { color: cssVar('--color-text-secondary') },
        nameTextStyle: { color: cssVar('--color-text-secondary') },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Velocity (fps)',
          nameLocation: 'middle',
          nameGap: 50,
          axisLine: { lineStyle: { color: cssVar('--color-chart-velocity') } },
          splitLine: { show: false },
          axisLabel: { color: cssVar('--color-text-secondary') },
          nameTextStyle: { color: cssVar('--color-chart-velocity') },
        },
        {
          type: 'value',
          name: 'Energy (ft·lbs)',
          nameLocation: 'middle',
          nameGap: 50,
          axisLine: { lineStyle: { color: cssVar('--color-chart-energy') } },
          splitLine: { show: false },
          axisLabel: { color: cssVar('--color-text-secondary') },
          nameTextStyle: { color: cssVar('--color-chart-energy') },
        },
      ],
      series: [
        {
          name: 'Velocity',
          type: 'line',
          yAxisIndex: 0,
          data: velData,
          smooth: true,
          lineStyle: { color: cssVar('--color-chart-velocity'), width: 2 },
          itemStyle: { color: cssVar('--color-chart-velocity') },
          symbol: 'none',
        },
        {
          name: 'Energy',
          type: 'line',
          yAxisIndex: 1,
          data: energyData,
          smooth: true,
          lineStyle: { color: cssVar('--color-chart-energy'), width: 2 },
          itemStyle: { color: cssVar('--color-chart-energy') },
          symbol: 'none',
        },
      ],
    }
  })

  /** Wind drift chart */
  const windDriftChartOptions = computed(() => {
    const driftData = points.value.map(p => [p.distanceYards, p.windDriftInches])
    const totalData = points.value.map(p => [p.distanceYards, p.totalLateralInches])
    return {
      backgroundColor: 'transparent',
      grid: { left: 60, right: 20, top: 30, bottom: 50 },
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['Wind Drift', 'Total Lateral'],
        textStyle: { color: cssVar('--color-text-secondary') },
        top: 0,
      },
      xAxis: {
        type: 'value',
        name: 'Distance (yds)',
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: { lineStyle: { color: cssVar('--color-chart-axis') } },
        splitLine: { lineStyle: { color: cssVar('--color-chart-grid'), type: 'dashed' } },
        axisLabel: { color: cssVar('--color-text-secondary') },
        nameTextStyle: { color: cssVar('--color-text-secondary') },
      },
      yAxis: {
        type: 'value',
        name: 'Drift (")',
        nameLocation: 'middle',
        nameGap: 45,
        axisLine: { lineStyle: { color: cssVar('--color-chart-axis') } },
        splitLine: { lineStyle: { color: cssVar('--color-chart-grid'), type: 'dashed' } },
        axisLabel: { color: cssVar('--color-text-secondary') },
        nameTextStyle: { color: cssVar('--color-text-secondary') },
      },
      series: [
        {
          name: 'Wind Drift',
          type: 'line',
          data: driftData,
          smooth: true,
          lineStyle: { color: cssVar('--color-chart-wind'), width: 2 },
          itemStyle: { color: cssVar('--color-chart-wind') },
          symbol: 'none',
        },
        {
          name: 'Total Lateral',
          type: 'line',
          data: totalData,
          smooth: true,
          lineStyle: { color: cssVar('--color-chart-trajectory'), width: 1.5, type: 'dashed' },
          itemStyle: { color: cssVar('--color-chart-trajectory') },
          symbol: 'none',
        },
      ],
    }
  })

  return {
    trajectoryChartOptions,
    velocityEnergyChartOptions,
    windDriftChartOptions,
  }
}
