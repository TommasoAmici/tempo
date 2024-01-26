import { writable } from "svelte/store";

export type ToastLevel = "info" | "error" | "success" | "warning";

type Toast = {
  id: number;
  message: string;
  level: ToastLevel;
};

const store = writable<Toast[]>([]);

class Toasts {
  list() {
    return store;
  }

  remove(id: number) {
    store.update((ts) => ts.filter((t) => t.id !== id));
  }

  /**
   * Toast a message with the given level
   */
  add(message: string, level: ToastLevel, timeout = 3000) {
    const id = Date.now();
    store.update((ts) => [...ts, { id, message, level }]);
    setTimeout(() => this.remove(id), timeout);
  }

  /**
   * Toast a message with level INFO
   */
  info(message: string) {
    this.add(message, "info");
  }

  /**
   * Toast a message with level ERROR
   */
  error(message: string) {
    this.add(message, "error");
  }

  /**
   * Toast a message with level SUCCESS
   */
  success(message: string) {
    this.add(message, "success");
  }

  /**
   * Toast a message with level WARNING
   */
  warning(message: string) {
    this.add(message, "warning");
  }
}

export const toasts = new Toasts();
