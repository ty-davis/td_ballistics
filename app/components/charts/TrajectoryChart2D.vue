<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, CanvasRenderer])

const { trajectoryChartOptions } = useChartOptions()
</script>

<template>
  <VChart
    class="w-full h-full"
    :option="trajectoryChartOptions"
    autoresize
  />
</template>
