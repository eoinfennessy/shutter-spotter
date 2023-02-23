export type UserCredentials = {
  email: string;
  password: string;
}

export type NewUser = UserCredentials & {
  firstName: string;
  lastName: string;
}

export type User = NewUser & {
  _id: string;
};

export type NewLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

export type NewLocationWithUserId = NewLocation & {
  userId: string;
}

export type Location = NewLocationWithUserId & {
  _id: string;
}

export type NewPhoto = {
  title: string;
  description: string;
};

export type NewPhotoWithLocationId = NewPhoto & {
  locationId: string;
};

export type Photo = NewPhotoWithLocationId & {
  _id: string;
};

export type UserStore = {
  getAllUsers: () => Promise<User[]>;
  addUser: (user: NewUser) => Promise<User>;
  getUserById: (id: string) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
  deleteUserById: (id: string) => Promise<void>;
  deleteAll(): Promise<void>;
};

export type LocationStore = {
  getAllLocations: () => Promise<Location[]>;
  addLocation: (location: NewLocationWithUserId) => Promise<Location>;
  getLocationById: (id: string) => Promise<Location | null>;
  getUserLocations: (userId: string) => Promise<Location[]>;
  deleteLocationById: (id: string) => Promise<void>;
  deleteAllLocations: () => Promise<void>;
};

export type PhotoStore = {
  getAllPhotos: () => Promise<Photo[]>;
  addPhoto: (photo: NewPhotoWithLocationId) => Promise<Photo>;
  getPhotosByLocationId: (id: string) => Promise<Photo[]>;
  getPhotoById: (id: string) => Promise<Photo | null>;
  deletePhoto: (id: string) => Promise<void>;
  deleteAllPhotos: () => Promise<void>;
  updatePhoto: (photoId: string, updates: Partial<NewPhoto>) => Promise<Photo | null>;
};

export type DbTypes = "mem" | "json" | "mongo";

export type Db = {
  userStore: UserStore;
  locationStore: LocationStore;
  photoStore: PhotoStore;
  init: (dbType: DbTypes) => void;
};
