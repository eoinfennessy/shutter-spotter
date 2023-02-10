export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type Location = {
  _id: string;
  userId: string;
  // photos?: Photo[];
  name: string;
  latitude: number;
  longitude: number;
};

export type Photo = {
  _id: string;
  locationId: string;
  name: string;
  description: string;
};

export type UserStore = {
  getAllUsers: () => Promise<User[]>;
  addUser: (user: Omit<User, "_id">) => Promise<User>;
  getUserById: (id: string) => Promise<User | null>;
  getUserByEmail: (email: String) => Promise<User | null>;
  deleteUserById: (id: String) => Promise<void>;
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
  init: () => void;
};
