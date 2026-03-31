<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { computed, ref } from 'vue'
import * as THREE from 'three'

const resultsStore = useResultsStore()
const animating = ref(false)
const animProgress = ref(0)

// Build CatmullRomCurve3 from trajectory points
const curve = computed(() => {
  const points = resultsStore.points
  if (!points.length) return null
  const threePoints = points.map(p => new THREE.Vector3(
    p.positionMeters[0],
    p.positionMeters[1],
    p.positionMeters[2],
  ))
  return new THREE.CatmullRomCurve3(threePoints)
})

// Scale factor: trajectory can be very long (meters) — normalize for viewing
const sceneScale = computed(() => {
  const pts = resultsStore.points
  if (!pts.length) return 1
  const maxX = pts[pts.length - 1]?.positionMeters[0] ?? 100
  return maxX > 0 ? 1 / maxX * 10 : 1
})

const targetPoint = computed(() => {
  const at = resultsStore.atTarget
  if (!at) return new THREE.Vector3(10, 0, 0)
  return new THREE.Vector3(
    at.positionMeters[0] * sceneScale.value,
    at.positionMeters[1] * sceneScale.value,
    at.positionMeters[2] * sceneScale.value,
  )
})

// Animation: compute bullet position along the curve
const bulletPosition = computed(() => {
  if (!curve.value) return new THREE.Vector3(0, 0, 0)
  const pt = curve.value.getPoint(animProgress.value)
  return new THREE.Vector3(
    pt.x * sceneScale.value,
    pt.y * sceneScale.value,
    pt.z * sceneScale.value,
  )
})

let animFrame: number | null = null

function startAnimation() {
  animProgress.value = 0
  animating.value = true
  const step = () => {
    animProgress.value = Math.min(animProgress.value + 0.005, 1)
    if (animProgress.value < 1) {
      animFrame = requestAnimationFrame(step)
    } else {
      animating.value = false
    }
  }
  animFrame = requestAnimationFrame(step)
}

function stopAnimation() {
  if (animFrame) cancelAnimationFrame(animFrame)
  animating.value = false
  animProgress.value = 0
}

onUnmounted(() => stopAnimation())
</script>

<template>
  <div class="card overflow-hidden p-0">
    <!-- Controls -->
    <div class="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-bg-elevated">
      <span class="text-xs text-text-muted">3D Trajectory</span>
      <span class="text-xs text-text-muted ml-1">· Drag to rotate · Scroll to zoom · Right-drag to pan</span>
      <div class="ml-auto flex gap-1">
        <button
          class="px-2 py-1 text-xs rounded bg-primary hover:bg-primary-hover text-white transition-colors"
          :disabled="!resultsStore.hasResult"
          @click="startAnimation"
        >
          Animate
        </button>
        <button
          v-if="animating"
          class="px-2 py-1 text-xs rounded bg-bg-overlay text-text-secondary hover:text-text-primary transition-colors border border-border-default"
          @click="stopAnimation"
        >
          Stop
        </button>
      </div>
    </div>

    <div class="h-96">
      <TresCanvas
        clear-color="#09090b"
        :alpha="false"
      >
        <!-- Lighting -->
        <TresAmbientLight :intensity="0.6" />
        <TresDirectionalLight :position="[5, 10, 5]" :intensity="0.8" />

        <!-- Orbit controls -->
        <OrbitControls enable-damping make-default />

        <!-- Ground plane grid -->
        <TresGridHelper :args="[20, 20, 0x3f3f46, 0x27272a]" />

        <!-- Bullet trajectory tube -->
        <template v-if="curve">
          <TresMesh>
            <TresTubeGeometry :args="[curve, 200, 0.02, 8, false]" />
            <TresMeshStandardMaterial color="#8a9a5b" :metalness="0.3" :roughness="0.5" />
          </TresMesh>
        </template>

        <!-- Target marker -->
        <TresMesh :position="[targetPoint.x, targetPoint.y, targetPoint.z]">
          <TresSphereGeometry :args="[0.08, 16, 16]" />
          <TresMeshStandardMaterial color="#f59e0b" :emissive="0xf59e0b" :emissive-intensity="0.3" />
        </TresMesh>

        <!-- Animated bullet sphere -->
        <TresMesh
          v-if="animating"
          :position="[bulletPosition.x, bulletPosition.y, bulletPosition.z]"
        >
          <TresSphereGeometry :args="[0.05, 12, 12]" />
          <TresMeshStandardMaterial color="#fbbf24" :emissive="0xfbbf24" :emissive-intensity="0.5" />
        </TresMesh>

        <!-- Muzzle marker (origin) -->
        <TresMesh :position="[0, 0, 0]">
          <TresSphereGeometry :args="[0.06, 12, 12]" />
          <TresMeshStandardMaterial color="#60a5fa" />
        </TresMesh>
      </TresCanvas>
    </div>

    <!-- Legend -->
    <div class="flex gap-4 px-3 py-2 border-t border-border-subtle bg-bg-elevated text-xs text-text-muted">
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-chart-trajectory inline-block" />
        Trajectory
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-chart-velocity inline-block" />
        Muzzle
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-accent inline-block" />
        Target
      </span>
    </div>
  </div>
</template>
