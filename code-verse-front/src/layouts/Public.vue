<template>
  <div class="content-layout">
    <header class="topbar">
      
    </header>

    <div class="main-area">

      <!-- Page Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>


<style scoped>
.content-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Top white header */
.topbar {
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* Main content area including sidebars */
.main-area {
  display: flex;
  flex: 1;
  height: calc(100vh - 40px);
  width: 100vw;
  overflow: hidden;
}


</style>
