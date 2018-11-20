<template>
  <div id="app">
    <router-view/>
    <div id="imgViewDom" @click="onClickImgBox" style="disply: none">
      <img @click="onClickImgBox" src="" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    onClickImgBox (e) {
      document.getElementById('imgViewDom').style.display = 'none'
    }
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
#imgViewDom{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 99999999;
  background: rgba(255, 255, 255,0.8);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
  transition: all ease-in-out .3s;
  overflow: scroll;
}
#imgViewDom img{
  max-width: 100%;
  cursor: zoom-out;
  margin-top: 100px;
}
</style>
