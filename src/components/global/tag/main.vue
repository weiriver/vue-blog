<template>
  <span style="display:inline-block;">
    <span class="tag"
          :style="{
               color: effect == 'plain' ? (color || colorList[index]) : 'white',
               borderColor:color ||colorList[index],
               backgroundColor: effect == 'plain' ? (color || colorList[index]+'20') : (color ||colorList[index])
          }"
          @click="click"
    ><slot></slot></span>
  </span>
</template>
<script>
export default {
  name: 'c-tag',
  props: {
    effect: {
      type: String,
      default: 'plain'
    },
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      colorList: [
        '#ff00ff',
        '#af0000',
        '#ffa500',
        '#d8b709',
        '#00ff00',
        '#008000',
        '#800080',
        '#c73cc1',
        '#059c1c',
        '#0096f3',
        '#ff5715',
        '#34da62',
        '#ff9915',
        '#ff9915',
        '#d0570e',
        '#eb3600',
        '#eb2100',
        '#8e49ff',
        '#1495ff',
        '#00addf',
        '#1a86ff',
        '#f98096',
        '#007849'
      ],
      index: 0
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  },
  mounted() {
    this.index = parseInt(Math.random() * this.colorList.length)
  }
}
</script>
<style lang="scss" scoped>
  .tag {
    border: 1px solid;
    border-radius: 4px;
    display: inline-block;
    height: 24px;
    padding: 0 8px;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }
</style>
