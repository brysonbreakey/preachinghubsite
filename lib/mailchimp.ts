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
 * Adds/updates a contact and always applies tags via a dedicated call —
 * the tags field on addListMember is unreliable for brand-new members.
 */
async function upsertContact({
  email,
  tags,
  mergeFields,
}: {
  email: string
  tags: string[]
  mergeFields: Record<string, string>
}): Promise<void> {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  if (!process.env.MAILCHIMP_API_KEY || !audienceId || !process.env.MAILCHIMP_SERVER_PREFIX) {
    throw new Error('mailchimp: env vars not configured')
  }
  setup()

  const tagPayload = tags.map((name) => ({ name, status: 'active' as const }))
  const hash = subscriberHash(email)

  try {
    await (mailchimp.lists as any).addListMember(audienceId, {
      email_address: email,
      status: 'subscribed',
      merge_fields: mergeFields,
    })
  } catch (err: any) {
    const isAlreadyMember =
      err?.status === 400 &&
      (err?.response?.body?.title === 'Member Exists' ||
        err?.response?.text?.includes('Member Exists'))
    if (!isAlreadyMember) throw err

    await (mailchimp.lists as any).updateListMember(audienceId, hash, { merge_fields: mergeFields })
  }

  await (mailchimp.lists as any).updateListMemberTags(audienceId, hash, { tags: tagPayload })
}

/**
 * Adds a contact to the Mailchimp audience tagged "checklist" (plus an
 * optional source tag from a ?src= param).
 */
export async function addChecklistContact({
  email,
  firstName,
  lastName,
  phone,
  src,
}: {
  email: string
  firstName: string
  lastName: string
  phone?: string
  src?: string
}): Promise<void> {
  await upsertContact({
    email,
    tags: ['checklist', ...(src ? [`src:${src}`] : [])],
    mergeFields: { FNAME: firstName, LNAME: lastName, ...(phone ? { PHONE: phone } : {}) },
  })
}

/**
 * Adds a contact to the Mailchimp audience tagged "try" with their phone
 * number as a merge field, for the /try free-evaluation intake form.
 */
export async function addTryLeadContact({
  email,
  firstName,
  lastName,
  phone,
}: {
  email: string
  firstName: string
  lastName: string
  phone: string
}): Promise<void> {
  await upsertContact({
    email,
    tags: ['try'],
    mergeFields: { FNAME: firstName, LNAME: lastName, PHONE: phone },
  })
}
