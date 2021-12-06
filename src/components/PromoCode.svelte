<script lang="ts">
  let coupon: string = "";
  let couponDisplayed: string = "";
</script>

<form class="flex items-center justify-center">
  {#if couponDisplayed}
    <span class="uppercase">{couponDisplayed}</span>
    <button class="coupon-btn remove" on:click={() => (couponDisplayed = "")}
      >Remove</button
    >
  {:else}
    <input
      class="form-input w-48 p-3 uppercase"
      bind:value={coupon}
      type="text"
      placeholder="Add Coupon"
    />
    <button
      class="coupon-btn"
      on:click={(e) => {
        e.preventDefault();
        couponDisplayed = coupon;
      }}
    >
      <span>Apply</span>
    </button>
  {/if}
</form>

<style lang="postcss">
  .coupon-btn {
    @apply ml-3;
    @apply flex;
    @apply items-center;
    @apply px-3;
    @apply py-2;
    @apply bg-blue-600;
    @apply text-white;
    @apply text-sm;
    @apply uppercase;
    @apply font-medium;
    @apply rounded;
    &.remove {
      @apply bg-red-500;
    }

    &:hover {
      @apply bg-blue-500;

      &.remove {
        @apply bg-red-600;
      }
    }
    &:focus {
      @apply outline-none;
      @apply bg-blue-500;
    }
  }
</style>
