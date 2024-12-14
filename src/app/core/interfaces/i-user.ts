import { IAkses } from "./i-akses";

export interface IUser {
  userId: number;
  namaLengkap: string;
  password?: string;
  unitKerja: string;
  email: string;
  nomorHP: string;
  aksesId?: IAkses;
}
