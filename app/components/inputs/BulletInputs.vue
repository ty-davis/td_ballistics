<script setup lang="ts">
const store = useInputStore()

const dragModelOptions = [
  { label: 'G7 (boat-tail)', value: 'G7' },
  { label: 'G1 (flat-base)', value: 'G1' },
]
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
        class="w-full"
      />
    </label>

    <div class="grid grid-cols-2 gap-2">
      <label class="input-label">
        Weight (gr)
        <InputNumber
          v-model="store.bullet.weightGrains"
          :min="30" :max="800" :step="1"
          fluid
        />
      </label>

      <label class="input-label">
        BC ({{ store.bullet.dragModel }})
        <InputNumber
          v-model="store.bullet.ballisticCoefficient"
          :min="0.05" :max="1.5" :step="0.001"
          :min-fraction-digits="3" :max-fraction-digits="3"
          fluid
        />
      </label>

      <label class="input-label">
        Diameter (in)
        <InputNumber
          v-model="store.bullet.diameterInches"
          :min="0.1" :max="1.0" :step="0.001"
          :min-fraction-digits="3" :max-fraction-digits="3"
          fluid
        />
      </label>

      <label class="input-label">
        Length (in)
        <InputNumber
          v-model="store.bullet.lengthInches"
          :min="0.3" :max="3.0" :step="0.01"
          :min-fraction-digits="3" :max-fraction-digits="3"
          fluid
        />
      </label>
    </div>
  </fieldset>
</template>
