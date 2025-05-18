    // src/app/models/user.model.ts
    export interface Address {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }

    export interface User {
      id: number;
      username: string;
      email: string;
      role: 'customer' | 'admin';
      fullName?: string;
      phone?: string;
      address?: Address;
    }
