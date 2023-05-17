// @ts-nocheck
export const githubOauth = {
  getToken: async function (code: string, clientId: string, clientSecret: string, redirectUri = "") {
    try {
      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: JSON.stringify({
          code: code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (res.ok === true) {
        const tokenData = await res.json();
        return { success: true, tokenData };
      }
      console.error("Response was not OK:", res.status);
      return { success: false, status: res.status };
    } catch (error) {
      console.error("Something went wrong:", error);
      return { success: false, error };
    }
  },

  getUserProfile: async function (token: string) {
    try {
      const res = await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.ok === true) {
        const profile = await res.json();
        return { success: true, profile };
      }
      console.error("Response was not OK:", res.status);
      return { success: false, status: res.status };
    } catch (error) {
      console.error("Something went wrong:", error);
      return { success: false, error };
    }
  },
};
