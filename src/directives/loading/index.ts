import Loading from '@/directives/loading/loading.vue';
import { createVNode, render } from 'vue';
import type { DirectiveBinding, VNode } from 'vue';

interface El extends HTMLElement {
  loadingVNode: VNode | null;
}

function toggleLoading(el: El, binding: DirectiveBinding, vnode?: VNode, umount = false) {
  if (umount) {
    render(null, el);
    el.loadingVNode = null;
  }
  if (binding.value) {
    el.style.position = 'relative';
    render(el.loadingVNode, el);
    return;
  }
  render(null, el);
}

export default {
  mounted(el: El, binding: DirectiveBinding) {
    const loadingVnode = createVNode(Loading);
    el.loadingVNode = loadingVnode;
    toggleLoading(el, binding);
  },

  updated(el: El, binding: DirectiveBinding, vnode: VNode) {
    toggleLoading(el, binding, vnode);
  },

  unmounted(el: El, binding: DirectiveBinding, vnode: VNode) {
    toggleLoading(el, binding, vnode, true);
  },
};
