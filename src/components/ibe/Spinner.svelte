<script>
  import { spinnerTranslations } from "../../lib/translations";
  export let language;

  function getRandomTranslation(lang) {
    const translations = spinnerTranslations[lang] || spinnerTranslations.en;
    const randomIndex = Math.floor(Math.random() * translations.length);
    return translations[randomIndex];
  }

  $: text = getRandomTranslation(language);
</script>

<!-- Hotel-themed, funny spinner overlay with dark mode support -->
<div
  class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 dark:bg-opacity-70 z-50"
>
  <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
    <img src="/images/spinner.gif" alt="Loading..." class="w-24 h-24 mx-auto" />
    <p class="mt-4 text-xl text-gray-700 dark:text-gray-300">
      {text}
    </p>
  </div>
</div>
