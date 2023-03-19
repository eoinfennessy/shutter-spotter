export type Id = string;

export type MongooseVersion = { __v: number };

export type JwtPayload = {
  id: Id;
  email: string;
  scope: string[];
};

// User

export type Email = string;
export type Password = string;
export type Name = {
  firstName: string;
  lastName: string;
};
export type Scope = string;

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

export type LocationCategory = "Landscape" | "Nature" | "Wildlife" | "Architecture" | "Macro" | "Aerial" | "Street";

export type NewLocation = {
  name: string;
  description: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
};

export type NewLocationWithUserId = NewLocation & {
  userId: Id;
};

export type Location = NewLocationWithUserId & {
  _id: Id;
};

// Photo

export type Comment = {
  userId: string;
  comment: string;
};

export type Vote = {
  userId: string;
  vote: -1 | 1;
};

export type BasePhoto = {
  title: string;
  description: string;
};

export type PhotoPayload = BasePhoto & {
  imagefile: NodeJS.ArrayBufferView | string;
  tags: string;
};

export type PhotoApiPayload = PhotoPayload & {
  userId: Id;
  locationId: Id;
};

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
