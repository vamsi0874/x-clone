import dotenv from 'dotenv';
dotenv.config();

import ngrok from '@ngrok/ngrok';

export async function startNgrok() {
  try {
    console.log('hiiiiiii')

    console.log('Starting ngrok...',process.env.NGROK_AUTHTOKEN);
    const listener = await ngrok.connect({
      addr: 3000,
      authtoken: "2w66M232Nj3mtbOWmqR7yvUfAoA_4xxrhJBEFe8ZA4k2fYD4c",  // explicitly pass it
    });

    console.log(`Ingress established at: ${listener.url()}`);
  } catch (error) {
    console.error('Error starting ngrok:', error);
  }
}
