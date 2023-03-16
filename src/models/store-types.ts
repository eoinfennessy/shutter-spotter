export type Id = string

export type MongooseVersion = { __v: number }

export type JwtPayload = {
  id: Id,
  email: string,
  scope: string[]
}

// User

export type Email = string;
export type Password = string;
export type Name = {
  firstName: string;
  lastName: string;
};

export type UserCredentials = {
  email: Email;
  password: Password;
};

export type NewUser = UserCredentials & Name;

export type User = NewUser & {
  _id: Id;
  scope: string[];
};

// Location

export type NewLocation = {
  name: string;
  description: string;
  category: "Landscape" | "Nature" | "Wildlife" | "Architecture" | "Macro" | "Aerial" | "Street";
  latitude: number;
  longitude: number;
};

export type NewLocationWithUserId = NewLocation & {
  userId: Id;
}

export type Location = NewLocationWithUserId & {
  _id: Id;
}

// Photo

export type Comment = {
  userId: string;
  comment: string;
}

export type Vote = {
  userId: string;
  vote: -1 | 1;
}

export type BasePhoto = {
  title: string;
  description: string;
};

export type PhotoPayload = BasePhoto & {
  imagefile: NodeJS.ArrayBufferView | string;
  tags: string;
}

export type PhotoApiPayload = PhotoPayload & {
  userId: Id,
  locationId: Id,
}

export type NewPhoto = BasePhoto & {
  locationId: Id;
  userId: Id;
  img: string;
  tags: string[];
  comments: Comment[];
  voteScore: number;
  votes: Vote[];
};

export type Photo = NewPhoto & {
  _id: Id;
};

// Stores

export type UserStore = {
  getAllUsers: () => Promise<User[]>;
  addUser: (user: NewUser) => Promise<User>;
  getUserById: (id: Id) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
  deleteUserById: (id: Id) => Promise<void>;
  deleteAll: () => Promise<void>;
  updateName: (id: Id, name: Name) => Promise<User | null>;
  updateEmail: (id: Id, email: Email) => Promise<User | null>;
  updatePassword: (id: Id, password: Password) => Promise<User | null>;
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
  addPhoto: (photo: NewPhoto) => Promise<Photo>;
  getPhotosByLocationId: (id: Id) => Promise<Photo[]>;
  getPhotoById: (id: Id) => Promise<Photo | null>;
  deletePhoto: (id: Id) => Promise<void>;
  deleteAllPhotos: () => Promise<void>;
  updatePhoto: (photoId: Id, updates: Partial<BasePhoto>) => Promise<Photo | null>;
};

export type DbTypes = "mem" | "json" | "mongo";

export type Db = {
  userStore: UserStore;
  locationStore: LocationStore;
  photoStore: PhotoStore;
  init: (dbType: DbTypes) => void;
};
