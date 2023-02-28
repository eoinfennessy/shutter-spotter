export type Id = string

export type MongooseVersion = { __v: number }

export type JwtPayload = {
  id: Id,
  email: string,
  scope: string[]
}

export type UserCredentials = {
  email: string;
  password: string;
}

export type NewUser = UserCredentials & {
  firstName: string;
  lastName: string;
}

export type User = NewUser & {
  _id: Id;
  scope: string[];
};

export type NewLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

export type NewLocationWithUserId = NewLocation & {
  userId: Id;
}

export type Location = NewLocationWithUserId & {
  _id: Id;
}

export type NewPhoto = {
  title: string;
  description: string;
};

export type NewPhotoWithLocationId = NewPhoto & {
  locationId: Id;
};

export type Photo = NewPhotoWithLocationId & {
  _id: Id;
};

export type UserStore = {
  getAllUsers: () => Promise<User[]>;
  addUser: (user: NewUser) => Promise<User>;
  getUserById: (id: Id) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
  deleteUserById: (id: Id) => Promise<void>;
  deleteAll: () => Promise<void>;
  addScope: (id: Id, scope: string) => Promise<void>;
};

export type LocationStore = {
  getAllLocations: () => Promise<Location[]>;
  addLocation: (location: NewLocationWithUserId) => Promise<Location>;
  getLocationById: (id: Id) => Promise<Location | null>;
  getUserLocations: (userId: Id) => Promise<Location[]>;
  deleteLocationById: (id: Id) => Promise<void>;
  deleteAllLocations: () => Promise<void>;
};

export type PhotoStore = {
  getAllPhotos: () => Promise<Photo[]>;
  addPhoto: (photo: NewPhotoWithLocationId) => Promise<Photo>;
  getPhotosByLocationId: (id: Id) => Promise<Photo[]>;
  getPhotoById: (id: Id) => Promise<Photo | null>;
  deletePhoto: (id: Id) => Promise<void>;
  deleteAllPhotos: () => Promise<void>;
  updatePhoto: (photoId: Id, updates: Partial<NewPhoto>) => Promise<Photo | null>;
};

export type DbTypes = "mem" | "json" | "mongo";

export type Db = {
  userStore: UserStore;
  locationStore: LocationStore;
  photoStore: PhotoStore;
  init: (dbType: DbTypes) => void;
};
