import {
  BasePhoto,
  Email,
  Id,
  Location,
  LocationCategory,
  Name,
  NewGitHubUser,
  NewLocationWithUserId,
  NewPhoto,
  NewUser,
  Password,
  Photo,
  User
} from "./schemas";

export type UserStore = {
  getAllUsers: () => Promise<User[]>;
  addUser: (user: NewUser | NewGitHubUser) => Promise<User>;
  getUserById: (id: Id) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
  deleteUserById: (id: Id) => Promise<void>;
  deleteAll: () => Promise<void>;
  updateName: (id: Id, name: Name) => Promise<User | null>;
  updateEmail: (id: Id, email: Email) => Promise<User | null>;
  updatePassword: (id: Id, password: Password) => Promise<User | null>;
  updateAvatarSrc: (id: Id, avatarSrc: string) => Promise<User | null>;
  addScope: (id: Id, scope: string) => Promise<void>;
  count: () => Promise<number>;
};

export type LocationStore = {
  getAllLocations: () => Promise<Location[]>;
  addLocation: (location: NewLocationWithUserId) => Promise<Location>;
  getLocationById: (id: Id) => Promise<Location | null>;
  getUserLocations: (userId: Id) => Promise<Location[]>;
  deleteLocationById: (id: Id) => Promise<void>;
  deleteAllLocations: () => Promise<void>;
  count: () => Promise<number>;
  countByCategory: () => Promise<Partial<Record<LocationCategory, number>>>;
};

export type PhotoStore = {
  getAllPhotos: () => Promise<Photo[]>;
  addPhoto: (photo: NewPhoto) => Promise<Photo>;
  getPhotosByLocationId: (id: Id) => Promise<Photo[]>;
  getPhotoById: (id: Id) => Promise<Photo | null>;
  deletePhoto: (id: Id) => Promise<void>;
  deleteAllPhotos: () => Promise<void>;
  updatePhoto: (photoId: Id, updates: Partial<BasePhoto>) => Promise<Photo | null>;
  count: () => Promise<number>;
};

export type DbTypes = "mem" | "json" | "mongo" | "firebase";

export type Db = {
  userStore: UserStore;
  locationStore: LocationStore;
  photoStore: PhotoStore;
  init: (dbType: DbTypes) => void;
  seed: () => void;
};
