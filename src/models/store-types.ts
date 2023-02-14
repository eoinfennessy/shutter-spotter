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

export type Location = {
  _id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type Photo = {
  _id: string;
  locationId: string;
  title: string;
  description: string;
};

export type UserStore = {
  getAllUsers: () => Promise<User[]>;
  addUser: (user: Omit<User, "_id">) => Promise<User>;
  getUserById: (id: string) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
  deleteUserById: (id: string) => Promise<void>;
  deleteAll(): Promise<void>;
};

export type LocationStore = {
  getAllLocations: () => Promise<Location[]>;
  addLocation: (location: Omit<Location, "_id">) => Promise<Location>;
  getLocationById: (id: string) => Promise<Location | null>;
  getUserLocations: (userId: string) => Promise<Location[]>;
  deleteLocationById: (id: string) => Promise<void>;
  deleteAllLocations: () => Promise<void>;
};

export type PhotoStore = {
  getAllPhotos: () => Promise<Photo[]>;
  addPhoto: (locationId: string, photo: Omit<Photo, "_id" | "locationId">) => Promise<Photo>;
  getPhotosByLocationId: (id: string) => Promise<Photo[]>;
  getPhotoById: (id: string) => Promise<Photo | null>;
  deletePhoto: (id: string) => Promise<void>;
  deleteAllPhotos: () => Promise<void>;
  updatePhoto: (photo: Photo, updatedPhoto: Omit<Photo, "_id" | "locationId">) => Promise<void>;
};

export type Db = {
  userStore: UserStore;
  locationStore: LocationStore;
  photoStore: PhotoStore;
  init: (dbType: "mem" | "json") => void;
};
