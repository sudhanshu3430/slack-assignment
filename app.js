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
app.event('app_home_opened', async ({ event, client }) => {
    try {
      await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Welcome to the app! Click the button to open the modal.*',
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Open Modal',
                  },
                  action_id: 'open_modal', // Action ID for the button
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  
  app.action('open_modal', async ({ body, ack, client }) => {
    await ack();
  
    const modalView = {
      type: 'modal',
      callback_id: 'modal_1',
      title: {
        type: 'plain_text',
        text: 'Your Input',
      },
      blocks: [
        {
          type: 'input',
          block_id: 'input_block',
          label: {
            type: 'plain_text',
            text: 'Please enter your answer',
          },
          element: {
            type: 'plain_text_input',
            action_id: 'input_value',
          },
        },
      ],
      submit: {
        type: 'plain_text',
        text: 'Submit',  // This defines the submit button
      },
    };
  
    await client.views.open({
      trigger_id: body.trigger_id,
      view: modalView,
    });
  });
  

  app.view('modal_1', async ({ ack, body, view, client }) => {
    await ack(); // Acknowledge the view submission
  
    const userInput = view.state.values.input_block.input_value.value; // Extract user input
  
    const resultModal = {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Your Input Submitted',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `You entered: *${userInput}*`, // Show the user input
          },
        },
      
      ],
    };
  
    await client.views.open({
      trigger_id: body.trigger_id,
      view: resultModal,
    });
  });
  
(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();