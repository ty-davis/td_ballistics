<script setup lang="ts">
const store = useInputStore()

const dragModelOptions = [
  { label: 'G7 (boat-tail, recommended)', value: 'G7' },
  { label: 'G1 (flat-base / general)', value: 'G1' },
]

const inputPT = {
  root: 'w-full',
  input: 'w-full bg-input-bg border border-input-border text-input-text rounded px-2 py-1.5 text-sm focus:border-primary focus:outline-none font-mono',
}
</script>

<template>
  <fieldset class="space-y-3">
    <legend class="section-label">Bullet / Ammunition</legend>

    <!-- Drag model -->
    <label class="input-label">
      Drag Model
      <SelectButton
        v-model="store.bullet.dragModel"
        :options="dragModelOptions"
        option-label="label"
        option-value="value"
        class="w-full text-xs"
        :pt="{
          root: 'flex gap-1',
          button: ({ context }) => ({
            class: [
              'flex-1 py-1.5 px-2 rounded border text-xs font-medium cursor-pointer transition-colors',
              context.active
                ? 'bg-primary border-primary text-white'
                : 'bg-bg-elevated border-border-default text-text-secondary hover:text-text-primary',
            ]
          }),
        }"
      />
    </label>

    <div class="grid grid-cols-2 gap-2">
      <label class="input-label">
        Weight (gr)
        <InputNumber
          v-model="store.bullet.weightGrains"
          :min="30" :max="800" :step="1"
          class="input-field"
          :pt="inputPT"
        />
      </label>

      <label class="input-label">
        BC ({{ store.bullet.dragModel }})
        <InputNumber
          v-model="store.bullet.ballisticCoefficient"
          :min="0.05" :max="1.5" :step="0.001"
          :min-fraction-digits="3" :max-fraction-digits="3"
          class="input-field"
          :pt="inputPT"
        />
      </label>

      <label class="input-label">
        Diameter (in)
        <InputNumber
          v-model="store.bullet.diameterInches"
          :min="0.1" :max="1.0" :step="0.001"
          :min-fraction-digits="3" :max-fraction-digits="3"
          class="input-field"
          :pt="inputPT"
        />
      </label>

      <label class="input-label">
        Length (in)
        <InputNumber
          v-model="store.bullet.lengthInches"
          :min="0.3" :max="3.0" :step="0.01"
          :min-fraction-digits="3" :max-fraction-digits="3"
          class="input-field"
          :pt="inputPT"
        />
      </label>
    </div>
  </fieldset>
</template>
