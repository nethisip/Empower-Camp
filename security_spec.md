# Security Spec - Battle Cry Camp Schedule

## Data Invariants
1. A 'Day' document must have a unique ID matching its document ID.
2. Events are stored as an array within each 'Day' document.
3. Only authenticated admin users can write to the 'days' collection.
4. Anyone (even unauthenticated) can read the 'days' collection to see the schedule. (Wait, given the user request, maybe we should restrict read to just authenticated users for privacy, or keep it open for public viewing of the schedule. I'll stick to public read since it's a camp website).

## The Dirty Dozen Payloads (Targeting /days/{dayId})
1. **Unauthenticated Write:** Attempt to update a day without being logged in. (Expected: DENIED)
2. **Identity Spoofing:** Attempt to change the `id` field of a day to something else. (Expected: DENIED)
3. **Ghost Fields:** Attempt to add `isAdmin: true` to a day document. (Expected: DENIED)
4. **Invalid Types:** Sending a string for the `events` field. (Expected: DENIED)
5. **Incomplete Schema:** Sending a day without the `theme` field. (Expected: DENIED)
6. **Poisonous IDs:** Document ID containing forbidden characters. (Expected: DENIED)
7. **Resource Exhaustion:** Sending a 1MB string for the `theme`. (Expected: DENIED)
8. **Malicious Events:** Events array containing objects without a `poc`. (Expected: DENIED)
9. **Timing Attack:** Attempting to set `createdAt` from the client. (Expected: DENIED)
10. **Admin Escalation:** A non-admin user attempting to create a new day. (Expected: DENIED)
11. **Orphaned Write:** Writing a day with an empty `label`. (Expected: DENIED)
12. **Terminal State Lock:** (Not applicable here as states aren't terminal, but we should ensure only admins can modify).

## The Test Runner (firestore.rules)
Will be verified via linting and audit.
