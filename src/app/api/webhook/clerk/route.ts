// src/app/api/webhook/clerk/route.ts
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const headersList = await headers();
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  // Get the webhook body
  const payload = await req.json();
  const { type, data } = payload as WebhookEvent;

  console.log(`Webhook received: ${type}`);

  try {
    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, primary_email_address_id } = data;
      
      if (!id) {
        return NextResponse.json({ success: false, error: 'No user ID provided' }, { status: 400 });
      }
      
      // Enhanced email extraction process with detailed logging
      let primaryEmail = '';
      let emailDebugLog = [];
      
      try {
        // First verify email_addresses array exists and is valid
        if (email_addresses && Array.isArray(email_addresses) && email_addresses.length > 0) {
          emailDebugLog.push(`Found ${email_addresses.length} email addresses`);
          
          // Try to find primary email if primary_email_address_id exists
          if (primary_email_address_id) {
            emailDebugLog.push(`Primary email ID found: ${primary_email_address_id}`);
            
            // Safely extract the primary email
            const primaryEmailObj = email_addresses.find(email => email.id === primary_email_address_id);
            
            if (primaryEmailObj) {
              emailDebugLog.push(`Found matching email object for primary ID`);
              
              if (primaryEmailObj.email_address) {
                primaryEmail = primaryEmailObj.email_address;
                emailDebugLog.push(`Successfully extracted primary email: ${primaryEmail}`);
              } else {
                emailDebugLog.push(`Warning: Primary email object lacks email_address property`);
              }
            } else {
              emailDebugLog.push(`Warning: Could not find email object matching primary ID`);
            }
          } else {
            emailDebugLog.push(`No primary_email_address_id found`);
          }
          
          // If primary email not found, use first available email as fallback
          if (!primaryEmail && email_addresses[0]) {
            emailDebugLog.push(`Using fallback: first available email`);
            
            if (email_addresses[0].email_address) {
              primaryEmail = email_addresses[0].email_address;
              emailDebugLog.push(`Set email to first available: ${primaryEmail}`);
            } else {
              emailDebugLog.push(`Warning: First email object lacks email_address property`);
            }
          }
        } else {
          emailDebugLog.push(`Warning: No valid email_addresses array found`);
        }
      } catch (emailError) {
        emailDebugLog.push(`Error extracting email: ${emailError instanceof Error ? emailError.message : String(emailError)}`);
        console.error('Email extraction error:', emailError);
      }
      
      // Log the email extraction process for debugging
      console.log('Email extraction log:', emailDebugLog.join(' → '));
      
      // If no email was found, use placeholder with user ID
      if (!primaryEmail) {
        console.log(`Warning: No email address found for user ${id}. Using placeholder.`);
        primaryEmail = `user_${id}@placeholder.com`;
      }
      
      // Prepare user name with fallbacks
      const firstName = first_name || '';
      const lastName = last_name || '';
      const name = `${firstName} ${lastName}`.trim() || 'User';
      
      console.log(`Syncing user: ${id}, ${name}, ${primaryEmail}`);

      // Create or update user with thorough error handling
      try {
        await prisma.user.upsert({
          where: { clerkId: id as string },
          update: {
            name,
            email: primaryEmail,
          },
          create: {
            clerkId: id as string,
            name,
            email: primaryEmail,
            mobileNumber: '',
            role: null, // Role will be set during onboarding
          },
        });

        console.log(`User ${id} synced successfully`);
      } catch (dbError) {
        console.error('Database error during user upsert:', dbError);
        return NextResponse.json({ 
          success: false, 
          error: 'Database error during user sync',
          details: dbError instanceof Error ? dbError.message : String(dbError)
        }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}