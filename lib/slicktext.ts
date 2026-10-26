// SlickText v2 API (https://api.slicktext.com/docs/v2/overview). The API has no
// "send a text" call: we create/update the contact with the personalised link in
// the `checklist_link` custom field, and a SlickText automation that triggers on
// that field changing sends the text.
const SLICKTEXT_BASE = 'https://dev.slicktext.com/v1'
const TIMEOUT_MS = 8000

export type SlickTextContact = {
  phone: string
  firstName: string
  lastName?: string
  email?: string
  customFields?: Record<string, string>
}

function digitsOnly(value: unknown): string {
  return String(value ?? '').replace(/\D/g, '')
}

async function request(path: string, apiKey: string, init: RequestInit = {}) {
  return fetch(`${SLICKTEXT_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
}

async function errorSummary(res: Response): Promise<string> {
  const text = await res.text().catch(() => '')
  return `${res.status} ${text.slice(0, 300)}`
}

// The docs don't say whether POST /contacts updates an existing number, so if it
// refuses we look the contact up by phone and update it instead. The lookup is
// only trusted if the contact it returns really has this number: the filter is
// undocumented, and an ignored filter would hand back someone else.
async function findContactId(brandId: string, apiKey: string, phone10: string): Promise<number | string | null> {
  for (const candidate of [`+1${phone10}`, phone10]) {
    const res = await request(`/brands/${brandId}/contacts?mobile_number=${encodeURIComponent(candidate)}&limit=50`, apiKey)
    if (!res.ok) continue
    const body = await res.json().catch(() => null)
    const match = (body?.data ?? []).find((c: { mobile_number?: unknown }) => digitsOnly(c.mobile_number).slice(-10) === phone10)
    if (match?.contact_id != null) return match.contact_id
  }
  return null
}

// Best-effort: never throws, so a SlickText problem can't fail the signup.
async function upsertContact(contact: SlickTextContact): Promise<void> {
  const apiKey = process.env.SLICKTEXT_API_KEY
  const brandId = process.env.SLICKTEXT_BRAND_ID
  if (!apiKey || !brandId) {
    console.error('slicktext: SLICKTEXT_API_KEY / SLICKTEXT_BRAND_ID not set')
    return
  }

  const digits = digitsOnly(contact.phone)
  const phone10 = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  if (phone10.length !== 10) {
    console.error('slicktext: skipped, phone is not a 10-digit US number')
    return
  }

  const fields = {
    mobile_number: `+1${phone10}`,
    first_name: contact.firstName,
    last_name: contact.lastName ?? '',
    ...(contact.email ? { email: contact.email } : {}),
    // Custom fields are top-level keys named by the field's internal name. A nested
    // `custom_fields` object is rejected on writes ("not a savable attribute"),
    // even though responses use that shape.
    ...(contact.customFields ?? {}),
  }
  // The form's consent notice covers a brand-new contact. An existing one keeps
  // whatever status it has: re-subscribing would undo a STOP they sent earlier.
  const createBody = JSON.stringify({ ...fields, opt_in_status: 'subscribed' })
  const updateBody = JSON.stringify(fields)

  try {
    // Look the contact up first: only a brand-new one is created as subscribed.
    // An existing contact is just updated, so a STOP they sent earlier stands.
    let existingId = await findContactId(brandId, apiKey, phone10)

    if (existingId == null) {
      const created = await request(`/brands/${brandId}/contacts`, apiKey, { method: 'POST', body: createBody })
      if (created.ok) {
        console.log('slicktext: contact created')
        return
      }
      const createFailure = await errorSummary(created)
      existingId = await findContactId(brandId, apiKey, phone10)
      if (existingId == null) {
        console.error('slicktext: create failed and no existing contact found:', createFailure)
        return
      }
    }

    const updated = await request(`/brands/${brandId}/contacts/${existingId}`, apiKey, { method: 'PUT', body: updateBody })
    if (updated.ok) {
      console.log('slicktext: existing contact updated')
    } else {
      console.error('slicktext: update failed:', await errorSummary(updated))
    }
  } catch (err) {
    console.error('slicktext: request failed', err)
  }
}

// Checklist signup: the link goes in `checklist_link`; a SlickText automation texts
// them when that field changes.
export function upsertChecklistContact(contact: {
  phone: string
  firstName: string
  lastName?: string
  email: string
  checklistLink: string
}): Promise<void> {
  const { checklistLink, ...rest } = contact
  return upsertContact({ ...rest, customFields: { checklist_link: checklistLink } })
}

// /try free-evaluation form: just name and phone, no automation field.
export function upsertTryContact(contact: { phone: string; firstName: string; lastName?: string }): Promise<void> {
  return upsertContact(contact)
}
