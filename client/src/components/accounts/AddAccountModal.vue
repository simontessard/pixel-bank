<template>
  <VueFinalModal
    v-model="internalShow"
    teleport-to="body"
    :clickToClose="true"
    :escToClose="true"
    :height="'auto'"
    :width="'auto'"
    class="flex justify-center items-center"
    overlay-class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    content-class="bg-white rounded-xl p-8 max-w-lg w-full mx-4"
    aria-label="Créer un nouveau compte"
  >
    <div @click.stop>
      <h3 class="text-2xl font-bold text-gray-800 mb-6">Créer un nouveau compte</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Nom du compte</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: Compte Vacances"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Type de compte</label>
          <select
            v-model="form.type"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="CHECKING">Compte Courant</option>
            <option value="SAVINGS">Compte Épargne</option>
          </select>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="close"
            class="flex-1 px-4 py-2.5 cursor-pointer border border-gray-300 rounded-full hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-full transition disabled:opacity-50"
          >
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { accountsAPI } from '@/services/api';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'created']);

const form = ref({
  name: '',
  type: 'CHECKING'
});

const loading = ref(false);
const error = ref('');

const internalShow = computed({
  get: () => props.show,
  set: (val: boolean) => {
    if (!val) emit('close');
  }
});

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    await accountsAPI.create(form.value);
    form.value = { name: '', type: 'CHECKING' };
    emit('created');
    emit('close');
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Erreur lors de la création';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  emit('close');
};

watch(() => props.show, (newVal) => {
  if (!newVal) {
    form.value = { name: '', type: 'CHECKING' };
    error.value = '';
  }
});
</script>
