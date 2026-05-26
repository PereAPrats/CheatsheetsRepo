<script lang="ts">
  export let value: string = "";
  export let placeholder: string = "Search";
</script>

<input
  type="search"
  {placeholder}
  class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:w-64 sm:px-4 sm:py-2.5 lg:w-80 lg:rounded-3xl lg:px-5 lg:py-3 lg:text-base"
  bind:value
/>
