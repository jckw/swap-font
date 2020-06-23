<script>
  //import Global CSS from the svelte boilerplate
  //contains Figma color vars, spacing vars, utility classes and more
  import { GlobalCSS } from "figma-plugin-ds-svelte";

  //import some Svelte Figma UI components
  import {
    Button,
    Input,
    Label,
    SelectMenu,
    Switch
  } from "figma-plugin-ds-svelte";

  //menu items, this is an array of objects to populate to our select menus
  let styleFonts = [
    { value: "dummy", label: "dummy", group: null, selected: false }
  ];
  let availableFonts = [
    { value: "dummy", label: "dummy", group: null, selected: false }
  ];
  let styles = [];

  var disabled = true;
  var selectedStyleFont;
  var selectedSwapFont;
  var count = 5;

  //this is a reactive variable that will return false when a value is selected from
  //the select menu, its value is bound to the primary buttons disabled prop
  $: disabled = selectedStyleFont === null;

  function swapFonts() {
    parent.postMessage(
      {
        pluginMessage: {
          type: "swap-fonts",
          originalFamily: selectedStyleFont.value,
          swapFamily: selectedSwapFont.value,
          forStyles: styles.filter(sty => sty.checked).map(({ id }) => id)
        }
      },
      "*"
    );
  }

  function cancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }

  window.onmessage = async event => {
    const msg = event.data.pluginMessage;
    if (msg.type === "text-style-families") {
      styleFonts = msg.families.map(fam => ({
        value: fam,
        label: fam,
        group: null,
        selected: false
      }));

      styles = msg.styles.map(sty => ({ ...sty, checked: true }));
      console.log(styles);
    }

    if (msg.type === "available-fonts") {
      availableFonts = msg.families.map(fam => ({
        value: fam,
        label: fam,
        group: null,
        selected: false
      }));
    }
  };
</script>

<style>
  /* Add additional global or scoped styles here */
</style>

<div class="wrapper p-xxsmall">
  {#each styles as sty}
    <Switch value={sty.id} bind:checked={sty.checked}>{sty.name}</Switch>
  {/each}

  <Label>Current font</Label>
  <SelectMenu
    bind:menuItems={styleFonts}
    bind:value={selectedStyleFont}
    class="mb-xxsmall" />

  <Label>Swap for</Label>
  <SelectMenu
    bind:menuItems={availableFonts}
    bind:value={selectedSwapFont}
    class="mb-xxsmall" />

  <div class="flex p-xxsmall mb-xsmall">
    <Button on:click={cancel} variant="secondary" class="mr-xsmall">
      Cancel
    </Button>
    <Button on:click={swapFonts} bind:disabled>Swap</Button>
  </div>

</div>
