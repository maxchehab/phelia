This guide will show you how to configure Phelia to post an interactive Slack message.

# Using the example project
Clone and setup the example project:
```bash
$ git clone https://github.com/maxchehab/phelia-message-example
$ cd phelia-message-example
$ yarn
$ cp .env.example .env
```

## File overview

- [`src/server.ts`](https://github.com/maxchehab/phelia-message-example/blob/master/src/server.ts) - A simple express server that handles webhook responses.
- [`src/random-image.tsx`](https://github.com/maxchehab/phelia-message-example/blob/master/src/random-image.tsx) - A message component to display random dog images.
- [`.env`](https://github.com/maxchehab/phelia-message-example/blob/master/.env.example) - A file with necessary environment variables

# Setting up the Slack App
## Register and install a Slack App through the app dashboard. 
1. Go to https://api.slack.com/apps and select **Create New App**.
2. Set a **Request URL** and an **Options Load URL** in the **Interactivity & Shortcuts** page of your Slack application. You will need to use a reverse proxy like [ngrok](https://ngrok.com) for local development.
  ![setting up interactive webhooks](https://raw.githubusercontent.com/maxchehab/phelia/master/screenshots/interactive-webhook-setup.png)
3. Under **OAuth & Permissions** add a `chat:write` scope. After you install the app into a workspace you can grab the **Bot User OAuth Access Token**. Save this value as the `SLACK_TOKEN` value in your `.env`.
4. Back under **Basic Information** you will need to grab your **Signing Secret**. Save this value as the `SLACK_SIGNING_SECRET` in your `env`.

# Posting the message
By now you should have `SLACK_SIGNING_SECRET` and `SLACK_TOKEN` variables saved in the `.env` and an interaction endpoint should be registered with Slack to handle user interactions. All that is left is grabbing your **Member ID** to post a message.

1. In your Slack workspace, select **View Profile** in the top left dropdown:
  ![select view profile in the top left dropdown](https://raw.githubusercontent.com/maxchehab/phelia/master/screenshots/view%20profile.png)
2. Copy your **Member ID** from the multimenu select within your profile: 
![select view profile in the top left dropdown](https://raw.githubusercontent.com/maxchehab/phelia/master/screenshots/copy-member-id.png)

Pass your Member ID as the second parameter to `client.postMessage` in [`src/server.ts`](https://github.com/maxchehab/phelia-message-example/blob/83d5a1ee75423253fa54980d68b98f76016cebd0/src/server.ts#L22-L23)
```diff
- client.postMessage(RandomImage, "YOUR MEMBER ID HERE");
+ client.postMessage(RandomImage, "U012089FBMY");
```

Now in the root of the project, run `yarn start`. You should immediately receive a message from your bot.
![slack message](https://raw.githubusercontent.com/maxchehab/phelia/master/screenshots/message.png)


If you run into any issues [join our community Slack](https://join.slack.com/t/phelia/shared_invite/zt-dm4ln2w5-6aOXvv5ewiifDJGsplcVjA) and we will try to get you sorted out 😃. If you are interested in learning more about  available components you should read the general [Documentation](https://github.com/maxchehab/phelia/wiki/Documentation).
