/**
 * Safe localStorage wrapper that handles Safari private mode and storage errors
 */

class SafeStorage {
  private isAvailable: boolean;
  private inMemoryStorage: Map<string, string>;

  constructor() {
    this.inMemoryStorage = new Map();
    this.isAvailable = this.checkAvailability();

    if (!this.isAvailable) {
      console.warn("⚠️ localStorage not available, using in-memory storage");
    } else {
      console.log("✅ localStorage available");
    }
  }

  private checkAvailability(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error("❌ localStorage check failed:", error);
      return false;
    }
  }

  setItem(key: string, value: string): void {
    if (this.isAvailable) {
      try {
        localStorage.setItem(key, value);
        console.log(`✅ storage.setItem("${key}") success`);
      } catch (error) {
        console.error(`❌ localStorage.setItem("${key}") failed:`, error);
        this.inMemoryStorage.set(key, value);
        console.log(`💾 Using in-memory storage for "${key}"`);
      }
    } else {
      this.inMemoryStorage.set(key, value);
      console.log(`💾 in-memory storage.setItem("${key}")`);
    }
  }

  getItem(key: string): string | null {
    if (this.isAvailable) {
      try {
        const value = localStorage.getItem(key);
        console.log(`🔍 storage.getItem("${key}"):`, value ? "found" : "not found");
        return value;
      } catch (error) {
        console.error(`❌ localStorage.getItem("${key}") failed:`, error);
        const value = this.inMemoryStorage.get(key) || null;
        console.log(`💾 Fallback to in-memory for "${key}":`, value ? "found" : "not found");
        return value;
      }
    } else {
      const value = this.inMemoryStorage.get(key) || null;
      console.log(`💾 in-memory storage.getItem("${key}"):`, value ? "found" : "not found");
      return value;
    }
  }

  removeItem(key: string): void {
    if (this.isAvailable) {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ storage.removeItem("${key}") success`);
      } catch (error) {
        console.error(`❌ localStorage.removeItem("${key}") failed:`, error);
        this.inMemoryStorage.delete(key);
      }
    } else {
      this.inMemoryStorage.delete(key);
      console.log(`💾 in-memory storage.removeItem("${key}")`);
    }
  }

  clear(): void {
    if (this.isAvailable) {
      try {
        localStorage.clear();
        console.log("🗑️ storage.clear() success");
      } catch (error) {
        console.error("❌ localStorage.clear() failed:", error);
        this.inMemoryStorage.clear();
      }
    } else {
      this.inMemoryStorage.clear();
      console.log("💾 in-memory storage.clear()");
    }
  }
}

export const storage = new SafeStorage();
