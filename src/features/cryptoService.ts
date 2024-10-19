class CryptoService {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  private key: CryptoKey | null = null;

  constructor() {}

  // Placeholder functions for storage
  private writeSaltToStorage(salt: Uint8Array): void {
    // TODO: Write salt to storage
  }

  private retrieveSaltFromStorage(): Uint8Array {
    // TODO: Retrieve salt from storage
    return new Uint8Array(); // Placeholder
  }

  private writeIvToStorage(iv: Uint8Array): void {
    // TODO: Write IV to storage
  }

  private retrieveIvFromStorage(): Uint8Array {
    // TODO: Retrieve IV from storage
    return new Uint8Array(); // Placeholder
  }

  private deleteSaltAndIvFromStorage(): void {
    // TODO: Delete salt and IV from storage
  }

  // Password Initialization: Generate salt, derive key, and store salt + IV
  public async initializePassword(
    password: string,
    plaintext: string,
  ): Promise<void> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    this.key = await this.deriveKey(password, salt);

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    this.writeSaltToStorage(salt);
    this.writeIvToStorage(iv);
  }

  // Derive key from password and salt
  private async deriveKey(
    password: string,
    salt: Uint8Array,
  ): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      this.encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"],
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  }

  // Encrypt function: Encrypt plaintext with password
  public async encrypt(password: string, plaintext: string): Promise<string> {
    if (!this.key) {
      const salt = this.retrieveSaltFromStorage();
      this.key = await this.deriveKey(password, salt);
    }

    const iv = this.retrieveIvFromStorage();

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      this.key,
      this.encoder.encode(plaintext),
    );

    const encryptedBytes = new Uint8Array(encryptedData);
    return btoa(String.fromCharCode(...encryptedBytes));
  }

  // Decrypt function: Decrypt ciphertext with password
  public async decrypt(password: string, ciphertext: string): Promise<string> {
    if (!this.key) {
      const salt = this.retrieveSaltFromStorage();
      this.key = await this.deriveKey(password, salt);
    }

    const iv = this.retrieveIvFromStorage();
    const encryptedBytes = Uint8Array.from(atob(ciphertext), (c) =>
      c.charCodeAt(0),
    );

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      this.key,
      encryptedBytes,
    );

    return this.decoder.decode(decryptedData);
  }

  // Cleanup logic: Delete Salt and IV from storage
  public cleanup(): void {
    this.key = null;
    this.deleteSaltAndIvFromStorage();
  }
}

export async function hashPassword(passwordString: string): Promise<string> {
  const data = new TextEncoder().encode(passwordString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  userEnteredPassword: string,
  storedHash: string,
): Promise<boolean> {
  const hash = await hashPassword(userEnteredPassword);
  return hash === storedHash;
}
