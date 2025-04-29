import { prisma } from '@/prisma';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    const evt = await verifyWebhook(req)

    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)
    
    if(eventType === 'user.created'){
        try {

            await prisma.user.create({
                data: {
                    id: evt.data.id,
                    username: evt.data.username!,
                    email: evt.data.email_addresses[0].email_address,
                },
            })
            return new Response('User created', { status: 200 })
        }
        catch (err) {
            console.log(err)
            return new Response('Error: Failed to create a user!', { status: 500 })
        }
    }
   
    if(eventType === 'user.deleted'){
        try {
            await prisma.user.delete({ where: { id: evt.data.id } })
            return new Response('User deleted', { status: 200 })
        }
        catch (err) {
            console.log(err)
            return new Response('Error: Failed to create a user!', { status: 500 })
        }
    }


    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
