import { aboutController } from "./controllers/about-controller.js";
import { accountSettingsController } from "./controllers/account-settings-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { adminController } from "./controllers/admin-controller.js"
import { dashboardController } from "./controllers/dashboard-controller.js";
import { locationController } from "./controllers/location-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  
  { method: "GET", path: "/accountsettings", config: accountSettingsController.index },
  { method: "POST", path: "/updatename", config: accountSettingsController.updateName },
  { method: "POST", path: "/updateemail", config: accountSettingsController.updateEmail },
  { method: "POST", path: "/updatepassword", config: accountSettingsController.updatePassword },
  { method: "GET", path: "/deleteaccount", config: accountSettingsController.deleteAccount },

  { method: "GET", path: "/admin", config: adminController.index },
  { method: "GET", path: "/admin/accounts", config: adminController.accounts },
  { method: "GET", path: "/admin/accounts/{id}/deleteaccount", config: adminController.deleteAccount },
  { method: "POST", path: "/admin/accounts/{id}/addscope", config: adminController.addScope },
  
  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addlocation", config: dashboardController.addLocation },
  { method: "GET", path: "/dashboard/deletelocation/{id}", config: dashboardController.deleteLocation },

  { method: "GET", path: "/location/{id}", config: locationController.index },
  { method: "POST", path: "/location/{id}/addphoto", config: locationController.addPhoto },
  { method: "GET", path: "/location/{id}/deletephoto/{photoid}", config: locationController.deletePhoto },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false as const } }
];
