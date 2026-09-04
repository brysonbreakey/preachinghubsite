import mailchimp from '@mailchimp/mailchimp_marketing'
import crypto from 'crypto'

function setup() {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY!,
    server: process.env.MAILCHIMP_SERVER_PREFIX!,
  })
}

function subscriberHash(email: string): string {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex')
}

/**
 * Adds a contact to the Mailchimp audience tagged "checklist" (plus an
 * optional source tag from a ?src= param). Never throws on Mailchimp
 * failure — callers should still treat the signup as failed if this
 * throws for a configuration/network reason, but "already a member" is
 * handled here as a success.
 */
export async function addChecklistContact({
  email,
  firstName,
  lastName,
  src,
}: {
  email: string
  firstName: string
  lastName: string
  src?: string
}): Promise<void> {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  if (!process.env.MAILCHIMP_API_KEY || !audienceId || !process.env.MAILCHIMP_SERVER_PREFIX) {
    throw new Error('mailchimp: env vars not configured')
  }
  setup()

  const tags = ['checklist', ...(src ? [`src:${src}`] : [])]
  const tagPayload = tags.map((name) => ({ name, status: 'active' as const }))
  const merge_fields = { FNAME: firstName, LNAME: lastName }

  try {
    await (mailchimp.lists as any).addListMember(audienceId, {
      email_address: email,
      status: 'subscribed',
      merge_fields,
      tags,
    })
  } catch (err: any) {
    const isAlreadyMember =
      err?.status === 400 &&
      (err?.response?.body?.title === 'Member Exists' ||
        err?.response?.text?.includes('Member Exists'))
    if (!isAlreadyMember) throw err

    const hash = subscriberHash(email)
    await (mailchimp.lists as any).updateListMember(audienceId, hash, { merge_fields })
    await (mailchimp.lists as any).updateListMemberTags(audienceId, hash, { tags: tagPayload })
  }
}
