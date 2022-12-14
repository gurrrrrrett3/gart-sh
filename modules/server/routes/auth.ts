import { Router } from "express";
import { db } from "../../..";
import fetch from "node-fetch";
const router = Router();

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/login", async (req, res) => {
  // generate discord login link
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const clientId = process.env.CLIENT_ID;
  const redirectURI = "https://gart.sh/auth/callback";

  // save state to db
  await db.state.create({
    data: {
      state,
    },
  });

  const url = new URL("https://discord.com/api/v10/oauth2/authorize");
  url.searchParams.append("client_id", clientId as string);
  url.searchParams.append("redirect_uri", redirectURI);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", "identify");
  url.searchParams.append("state", state);

  res.redirect(url.toString());
});

router.get("/callback", async (req, res) => {
  // get state from db
  const state = await db.state.findFirst({
    where: {
      state: req.query.state as string,
    },
  });

  if (!state) {
    res.redirect("/?error=Invalid+state+provided%2C+please+try+again");
    return;
  }

  const qs = req.query;
  if (qs.error) {
    res.redirect(`/?error=${qs.error}`);
    return;
  }

  if (qs.code) {
    const code = qs.code as string;
    const redirectURI = "https://gart.sh/auth/callback";

    const url = new URL("https://discord.com/api/v10/oauth2/token");

    const body = new URLSearchParams();
    body.append("client_id", process.env.CLIENT_ID as string);
    body.append("client_secret", process.env.CLIENT_SECRET as string);
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", redirectURI);
    body.append("scope", "identify");

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const json = (await response.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    };

    const userResponse = (await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${json.token_type} ${json.access_token}`,
      },
    }).then((res) => res.json())) as {
      id: string;
      username: string;
      avatar: string;
      discriminator: string;
    };

    // save token to db

    const expiresAt = new Date(Date.now() + json.expires_in * 1000);

    if (!json.expires_in) {
      res.redirect("/?error=Internal+error%2C+please+try+again");
      return;
    }

    let user = await db.token
      .upsert({
        create: {
          accessToken: json.access_token,
          refreshToken: json.refresh_token,
          expiresAt,
          scope: json.scope,
          tokenType: json.token_type,
          User: {
            connectOrCreate: {
              create: {
                username: userResponse.username,
                avatar: userResponse.avatar,
                discordId: userResponse.id,
              },
              where: {
                discordId: userResponse.id,
              },
            },
          },
        },
        update: {
          accessToken: json.access_token,
          refreshToken: json.refresh_token,
          expiresAt,
          scope: json.scope,
          tokenType: json.token_type,
          User: {
            connectOrCreate: {
              create: {
                username: userResponse.username,
                avatar: userResponse.avatar,
                discordId: userResponse.id,
              },
              where: {
                discordId: userResponse.id,
              },
            },
          },
        },
        where: {
          id: userResponse.id,
        },
      })
      .catch((e) => {
        console.error(e);
        return null;
      });

    if (!user) {
      user = await db.token.findFirst({
        where: {
          User: {
            every: {
              discordId: userResponse.id,
            },
          },
        },
      });
    }

    if (!user) {
        res.redirect("/?error=Internal+error%2C+please+try+again");
        return;
    }

    // create session link
    const session = await db.sessionLink
      .create({
        data: {
          userId: user.id,
        },
      })
      .catch((e) => {
        console.error(e);
        return;
      });

    if (!session) {
      res.redirect("/?error=Internal+error%2C+please+try+again");
      return;
    }

    res.cookie("session", session.id, {
      httpOnly: false,
      maxAge:  1000 * 60 * 60 * 24 * 7
    });

    res.redirect(`/?log=<span+class="green">Logged+in+as+${userResponse.username}!</span>`);
  }
});

router.get("/logout", async (req, res) => {
  if (!req.body || !req.body.cookie || typeof req.body.cookie != "string") return res.redirect(`/?error=You+are+not+logged+in.+<a+href="/auth/login">Login</a>`);
  const s = req.body.cookie.split("=")[1]
  if (!s) {
    res.redirect("/?error=You+are+not+logged+in");
    return;
  }

  const session = await db.sessionLink.findFirst({
    where: {
      id: s,
    },
  });

  if (!session) {
    res.redirect("/?error=You+are+not+logged+in");
    return;
  }

  await db.sessionLink.delete({
    where: {
      id: session.id
    },
  });

  res.clearCookie("session");
  res.redirect("/?log=<span+class=\"green\">Logged+out!</span>");

});

router.post("/status", async (req, res) => {
  console.log(req.body)
  if (!req.body || !req.body.cookie || typeof req.body.cookie != "string") return res.send(`You are not logged in. <a href="/auth/login">Login</a>`);
  const s = req.body.cookie.split("=")[1]

  if (!s) {
    res.send(`You are not logged in. <a href="/auth/login">Login</a>`);
    return;
  } else {
    const session = await db.sessionLink.findFirst({
      where: {
        id: s,
      },
    });

    if (!session) {
      res.send(`You are not logged in. <span class="red">Session expired</span> <a href="/auth/login">Login</a>`);
      return;
    }

    const user = await db.user.findFirst({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      res.send(`You are not logged in. <span class="red">User not found</span> <a href="/auth/login">Login</a>`);
      return;
    }

    res.send(`You are logged in as <span class="cyan">${user.username}</span>, with id <span class="green">${user.id}</span> (<span class="green">${user.discordId}</span>)`);
  }
  
  
})

export default router;
