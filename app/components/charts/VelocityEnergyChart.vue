<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const { velocityEnergyChartOptions } = useChartOptions()
</script>

<template>
  <VChart
    class="w-full h-full"
    :option="velocityEnergyChartOptions"
    autoresize
  />
</template>
