const GUEST_ID_KEY = 'bv_guest_id'

// A stable, anonymous ID persisted in localStorage so guest view counts stay
// unique per browser instead of incrementing on every page refresh.
export const getGuestId = (): string => {
  let id = localStorage.getItem(GUEST_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(GUEST_ID_KEY, id)
  }
  return id
}
