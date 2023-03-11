import { readFileSync } from "fs";
const imagefile = readFileSync("./test/test-image.png");

export const testPhotos = [
  {
    title: "Landscape",
    description: "A beautiful landscape photo",
    tags: "landscape sunset",
    imagefile: imagefile,
  },
  {
    title: "Seascape",
    description: "A beautiful seascape photo",
    tags: "seascape",
    imagefile: imagefile,
  },
  {
    title: "Wildlife",
    description: "A beautiful wildlife photo",
    tags: "",
    imagefile: imagefile,
  },
];

export const birdPhoto = {
  title: "Birds",
  description: "A beautiful bird photo",
  tags: "wildlife birds",
  imagefile: imagefile,
};
