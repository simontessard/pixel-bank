<template>
  <div class="hidden lg:flex grow min-h-screen max-h-screen lg:w-1/2 p-3">
    <div class="flex flex-col justify-between bg-gradient-primary w-full rounded-3xl p-10 xl:p-16 2xl:p-24">

      <div>
        <h1 ref="title" class="text-white text-lg md:text-xl mb-1 md:mb-1.5">
          PixelBank
        </h1>

        <div class="overflow-hidden mb-2 xl:mb-3">
          <p ref="paragraph" class="translate-y-full opacity-0 text-white font-light">
            Oui c'est vraiment le moment,
          </p>
        </div>

        <h3 ref="titleH3" class="opacity-0 text-2xl xl:text-4xl tracking-tight text-white">
          Pour mieux gérer votre argent.
        </h3>
      </div>

      <h2 ref="titleH2" class="text-4xl xl:text-5xl 2xl:text-6xl tracking-tight font-medium text-white">
        Rapide, sécurisé, <br/> gratuit.
      </h2>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const title = ref(null)
const paragraph = ref(null)
const titleH2 = ref(null)
const titleH3 = ref(null)

onMounted(() => {
  gsap.from(title.value, {
    opacity: 0,
    x: -20,
    duration: 0.6,
    ease: 'power2.out'
  })

  gsap.to(paragraph.value, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  })

  gsap.to(titleH3.value, {
    opacity: 1,
    duration: 1.5,
    delay : .2,
    ease: 'power2.out'
  })

  gsap.from(titleH2.value, {
    opacity: 0,
    y: 20,
    duration: 1,
    delay : .2,
    ease: 'power2.out'
  })
})
</script>
