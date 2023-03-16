import { NewLocation } from "../src/models/store-types";

export const serviceUrl = "http://localhost:3000";

export const testUsers = [
  {
    firstName: "Homer",
    lastName: "Simpson",
    email: "homer@simpson.com",
    password: "secret",
  },
  {
    firstName: "Marge",
    lastName: "Simpson",
    email: "marge@simpson.com",
    password: "secret",
  },
  {
    firstName: "Bart",
    lastName: "Simpson",
    email: "bart@simpson.com",
    password: "secret",
  },
];

export const maggie = {
  firstName: "Maggie",
  lastName: "Simpson",
  email: "maggie@simpson.com",
  password: "secret",
};

export const lisa = {
  firstName: "Lisa",
  lastName: "Simpson",
  email: "lisa@simpson.com",
  password: "secret",
};

export const superAdmin = {
  firstName: "Super",
  lastName: "Admin",
  email: "super@admin.com",
  password: "secret",
};

export const testLocations: NewLocation[] = [
  {
    name: "Woodstown",
    description: "A beautiful beach",
    category: "Landscape",
    latitude: 80,
    longitude: 80
  },
  {
    name: "Dunmore East",
    description: "A scenic fishing village",
    category: "Landscape",
    latitude: 0,
    longitude: -10
  },
  {
    name: "Tramore",
    description: "A big beach with dunes overlooking the town of Tramore",
    category: "Landscape",
    latitude: -10,
    longitude: 0
  }
];

export const waterford: NewLocation = {
  name: "Waterford",
  description: "A beautiful city with a rich Viking and Norman history",
  category: "Street",
  latitude: -10,
  longitude: 10
}

export const testPhotos = [
  {
    title: "Landscape",
    description: "A beautiful landscape photo",
    votes: [],
    comments: [],
    tags: [], 
    voteScore: 0,
  },
  {
    title: "Seascape",
    description: "A beautiful seascape photo",
    votes: [],
    comments: [],
    tags: [], 
    voteScore: 0,
  },
  {
    title: "Wildlife",
    description: "A beautiful wildlife photo",
    votes: [],
    comments: [],
    tags: [], 
    voteScore: 0,
  },
];

export const birdPhoto = {
  title: "Birds",
  description: "A beautiful bird photo",
  votes: [],
  comments: [],
  tags: [], 
  voteScore: 0,
}