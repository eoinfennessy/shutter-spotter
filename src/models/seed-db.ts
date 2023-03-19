import { Db, Password } from "./store-types";

export const createSuperAdminIfNotExists = async function (db: Db, password: Password) {
  const superadmin = await db.userStore.getUserByEmail("superadmin@shutterspotter.com");
  if (superadmin !== null) return;
  const newSuperadmin = await db.userStore.addUser({
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@shutterspotter.com",
    password: password,
  });
  await db.userStore.addScope(newSuperadmin._id, "admin");
  await db.userStore.addScope(newSuperadmin._id, "super-admin");
};
