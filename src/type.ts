import { FieldValue } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  displayName: string;
  age: number;
  email: string;
  createdAt: FieldValue;
  profileCompleted?: boolean;
};