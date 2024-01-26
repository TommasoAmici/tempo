<script lang="ts">
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";

  export let value: string | undefined = undefined;
  export let label = "Date";
  export let onChange: (
    e: CustomEvent<
      | string
      | {
          selectedDates: [dateFrom: Date, dateTo?: Date | undefined];
          dateStr: string | { from: string; to: string };
        }
    >,
  ) => void;
</script>

<DatePicker
  bind:value
  on:change={onChange}
  datePickerType="single"
  dateFormat="Y-m-d"
>
  <DatePickerInput labelText={label} />
</DatePicker>

<style>
  :global(.flatpickr-calendar.open) {
    width: unset;
  }
  :global(
      .bx--date-picker-container,
      .bx--date-picker.bx--date-picker--single,
      .bx--date-picker.bx--date-picker--single .bx--date-picker__input,
      .bx--date-picker-input__wrapper .flatpickr-wrapper
    ) {
    width: 100%;
  }
</style>
