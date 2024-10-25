require('dotenv').config();
const { App } = require('@slack/bolt');

/* 
This sample slack application uses SocketMode
For the companion getting started setup guide, 
see: https://slack.dev/bolt-js/tutorial/getting-started 
*/

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});


// The echo command simply echoes on command
app.command('/ticket', async ({ ack, body, client, logger }) => {
    // Acknowledge the command request
    await ack();
  
    try {
      // Call views.open with the built-in client
      const result = await client.views.open({
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: body.trigger_id,
        // View payload
        view: {
          type: 'modal',
          // View identifier
          callback_id: 'view_1',
          title: {
            type: 'plain_text',
            text: 'Modal title'
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Welcome to a modal with _blocks_'
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Click me!'
                },
                action_id: 'button_abc'
              }
            },
            {
              type: 'input',
              block_id: 'input_c',
              label: {
                type: 'plain_text',
                text: 'What are your hopes and dreams?'
              },
              element: {
                type: 'plain_text_input',
                action_id: 'dreamy_input',
                multiline: true
              }
            }
          ],
          submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      });
      logger.info(result);
    }
    catch (error) {
      logger.error(error);
    }
});
app.action('button_abc', async ({ ack, body, client, logger }) => {
    // Acknowledge the button request
    await ack();
  
    try {
      if (body.type !== 'block_actions' || !body.view) {
        return;
      }
      // Call views.update with the built-in client
      const result = await client.views.update({
        // Pass the view_id
        view_id: body.view.id,
        // Pass the current hash to avoid race conditions
        hash: body.view.hash,
        // View payload with updated blocks
        view: {
          type: 'modal',
          // View identifier
          callback_id: 'view_1',
          title: {
            type: 'plain_text',
            text: 'Updated modal'
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: 'You updated the modal!'
              }
            },
            {
              type: 'image',
              image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
              alt_text: 'Yay! The modal was updated'
            }
          ]
        }
      });
      logger.info(result);
    }
    catch (error) {
      logger.error(error);
    }
});
app.view('view_1', async ({ ack, body }) => {
    await ack({
      response_action: 'update',
      view: buildNewModalView(body),
    });
  });
(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();