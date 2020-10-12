export interface User {
  id: string;
  authId: string;
  name: string;
  emails: string[];
  isPlatformAdmin: boolean;
}
