# Localhost: broken onboarding playtest

**Playtest setting:** Fake AI paywall popups are temporarily disabled in the shared PC/mobile/native game at the user’s request. New runs, retries and compaction keep them disabled. The implementation is retained for later review; dedicated billing fixtures explicitly enable it.


Implemented locally on October 16, 2026. The center’s recurring bad habit is overconfident onboarding: each team calls its own broken system the correct procedure. Players escape workplace disasters; no proof pads, claim gates or new controls are required.

## Play it

Open **Data Centers → Localhost → 01 · Hello Unrecognized World** to play the full revised center from its beginning. Existing clear records remain intact. **Practice any playable server** starts one selected server without changing campaign progress. In the mobile pause menu, expand **Work order** only if you want a hint.

Following Garbage Collection Day playtesting, [idle pressure and garbage collection](LOCALHOST_CLEANUP.md) now run on all twenty Localhost servers. Short stops are covered; green maintenance bays and Pause suspend the timer. The direct **Try Idle Compute · DC1 / 15** practice entry remains available.

Suggested quick samples: server 03 for walk-versus-jump decisions, server 12 for waiting out an inbox backlog, server 16 for expiring bridge contracts, and server 20 for the combined incident.

The twenty server IDs and titles remain stable so existing progress survives. All twenty physical layouts change through authored encounter order, gaps, widths, telegraph delays, forecast parameters or bridge deadlines. The original fifteen-level game is preserved.

## Feedback to collect

- Which server can you describe afterward without using its number?
- Did you understand the trick after getting caught, and could you deliberately handle it next time?
- Which loss felt funny, confusing, or tedious?
- Did the waiting and rewrite sections change the rhythm enough?
- Could you read the work orders, loss remarks and escape excuses comfortably on the phone?

Keep this as a playtest, not a claim that the redesign is more fun. The automated route establishes solvability; player feedback decides the direction.

## Implemented behavior

- Twenty incident cards document the problem, what to notice, memorable beat, counterplay and final excuse.
- Sixty new server-specific loss remarks rotate alongside the existing hazard library; the 15-second reading pause and two-press skip remain. Cursors survive reload when storage is available.
- Twenty escape excuses appear as a quiet 12-second paper receipt at the start of the next server. Reading pauses freeze that clock. The next clear replaces the visible receipt; mobile AI Log retains encountered excuses. Practice/final completion also includes the relevant excuse on its completion screen. Death never awards an incident-survived receipt.
- The directory shows each server’s work-order nickname. The pause menu offers optional observation/counterplay help. Work-order labels and receipts reserve space from background jokes.
- Background failure/progress remarks keep their randomized per-attempt placement. Identity labels are screen labels, not death/trap coordinates.
- Wider contractor gaps require rewriting. Three bridge contracts in server 16 get progressively shorter. Overhead/grounded scan order, repeated message drops and revised delivery targets create different decisions.

## Authoring sources

[Incident cards and outcome voice](campaign/localhost-incidents.json), [physical recipes](campaign/localhost.json), [background voice](campaign/localhost-voice.json), [compiler](campaign/encounters.js), [shared runtime](campaign/runtime.js). Rebuild using `python3 tools/build-mobile.py`; native build scripts invoke that pipeline.

The rest of this document contains design spoilers.

## Server identity cards

### localhost-01 · Welcome Mat Decommissioning

**What goes wrong:** The welcome team deleted the floor before you finished arriving.

**Notice:** A marked strip opens after you approach.

**Memorable beat:** The welcome mat resigns mid-step.

**Counterplay:** Jump across the opening; the ordinary floor beyond it stays solid.

**AI excuse:** The floor left before you completed its orientation.

### localhost-02 · Visitor Badge Rejected

**What goes wrong:** Reception has mistaken the visitor for an intrusion.

**Notice:** The second hazard is a real scanner field at walking height.

**Memorable beat:** A badge check with no useful badge.

**Counterplay:** Cross the redaction, then jump the actual red scan field.

**AI excuse:** Reception confirms the intrusion has left the building.

### localhost-03 · The Upstairs Security Team

**What goes wrong:** Security installed its first detector above the floor it marked.

**Notice:** The revised field appears overhead; the next scan stays low.

**Memorable beat:** Walking beneath an invitation to jump.

**Counterplay:** Walk beneath the airborne field, jump the low scan, then clear the missing strip.

**AI excuse:** Upstairs Security says it was checking taller visitors.

### localhost-04 · Mandatory Agility Training

**What goes wrong:** Training alternates between problems above your head and below your feet.

**Notice:** Identical floor claims produce different field heights.

**Memorable beat:** Walk, jump, walk, jump; the labels cannot choose for you.

**Counterplay:** Read the revised fields and alternate walking with jumping.

**AI excuse:** Training says your survival proves the training works.

### localhost-05 · Reception-Wide Outage

**What goes wrong:** Every desk has independently activated its emergency procedure.

**Notice:** The longer route repeats learned hazards with breathing space.

**Memorable beat:** The whole reception area decides you are the emergency.

**Counterplay:** Use the actual fields and floor openings; pause safely between encounters.

**AI excuse:** The outage ended after the customer stopped reporting it.

### localhost-06 · The Contractor Bridge

**What goes wrong:** Facilities filled the missing floor with a temporary assertion.

**Notice:** The gap is wider than a normal jump and Rewrite can supply support.

**Memorable beat:** A bridge whose employment contract expires.

**Counterplay:** Rewrite beside NULL, then cross while the green support is active.

**AI excuse:** Facilities says the bridge worked long enough to count.

### localhost-07 · Turnstile Without a Door

**What goes wrong:** Access Control installed a solid wall where a doorway should be.

**Notice:** Rewrite changes the wall into temporary air; another hazard follows.

**Memorable beat:** An argument that can be walked through.

**Counterplay:** Rewrite the nearby wall, pass through, then read the next warning.

**AI excuse:** Access Control says the wall was on an approved break.

### localhost-08 · Intern Granted Push Access

**What goes wrong:** An intern connected a floor seam directly to the Git hook.

**Notice:** The overhead rejection block identifies a launchpad below.

**Memorable beat:** The onboarding shortcut commits the employee.

**Counterplay:** Borrow the bridge, then jump the auto-commit seam instead of stepping on it.

**AI excuse:** The intern has been blamed. My instructions remain perfect.

### localhost-09 · Three Approvals Required

**What goes wrong:** The exit requires departments that disagree about what passage means.

**Notice:** Each rewrite has its own visible expiry; the last scan needs a jump.

**Memorable beat:** A short tour of incompatible approvals.

**Counterplay:** Pass the seal, activate the bridge when nearby, and clear the low scan.

**AI excuse:** All approvals were technically present at different times.

### localhost-10 · Route Optimizer Support Ticket

**What goes wrong:** A routing tool arranged the onboarding defects into a recommended itinerary.

**Notice:** The tool name does not alter the physical hazard warnings.

**Memorable beat:** Following the optimized route requires ignoring its confidence.

**Counterplay:** Handle each known hazard in order and use the safe landings to regroup.

**AI excuse:** The optimizer says surviving proves its route was correct.

### localhost-11 · Predictive Attendance

**What goes wrong:** Attendance forecasts where you will stand, then deletes that location.

**Notice:** Gold brackets lock ahead; they stop tracking before the purge.

**Memorable beat:** Let the attendance system mark empty paper absent.

**Counterplay:** Approach to lock the target, wait outside it, then cross after the purge.

**AI excuse:** Attendance says an empty target is a successful forecast.

### localhost-12 · Inbox Delivery Backlog

**What goes wrong:** The message queue insists that notifications must reach the floor.

**Notice:** Three receipts fall separately before the final forecast.

**Memorable beat:** An inbox that accepts skulls as delivery confirmations.

**Counterplay:** Wait outside each landing area and cross when its receipt has gone.

**AI excuse:** Delivery says all notices arrived. Hitting you was optional.

### localhost-13 · Upstairs Versus Downstairs

**What goes wrong:** Two scanner teams disagree about which altitude is suspicious.

**Notice:** Red floor flags alternate between airborne and grounded fields.

**Memorable beat:** The safest action changes while the signs look familiar.

**Counterplay:** Walk under the high fields and jump the low ones after checking their revision.

**AI excuse:** Both scanner teams claim they let you through on purpose.

### localhost-14 · Address Correction Service

**What goes wrong:** Support moves a falling notice toward the customer before fixing its final target.

**Notice:** The drop warning revises once and then stays locked.

**Memorable beat:** Customer service follows you only until the address is finalized.

**Counterplay:** Stay out of the revised column, let it fall, then handle the next lock.

**AI excuse:** Support updated the address without admitting the error.

### localhost-15 · Idle Compute / Cleanup Trial

**What goes wrong:** Slow progress makes the AI classify the running instance as abandoned and delete the level behind the player.

**Notice:** The compute meter fills; a clear warning precedes the deletion edge. Two receipt columns lock only after crossing their entry scans.

**Memorable beat:** Run from cleanup, rest in the green maintenance bay, then commit to the second stretch.

**Counterplay:** Keep making new forward progress, run clear of locked receipt columns, and use maintenance or Pause to think. Real required forecast waits suspend cleanup.

**AI excuse:** The session was productive only after I began deleting it.

### localhost-16 · Short-Term Infrastructure

**What goes wrong:** Facilities renewed three bridges on contracts with progressively less patience.

**Notice:** Each gap needs its own nearby rewrite; support visibly expires.

**Memorable beat:** Cross a series of borrowed floors before their individual deadlines.

**Counterplay:** Activate each bridge from its edge and cross promptly; rest on solid ground.

**AI excuse:** Facilities says temporary bridges cannot promise more.

### localhost-17 · Security Refresher Course

**What goes wrong:** Training repeats the dangerous seam and inserts a notice between assessments.

**Notice:** The Git blocks remain overhead, even before a seam launches.

**Memorable beat:** Passing the course immediately enrolls you again.

**Counterplay:** Jump both launchpads, clear the scan and wait out the falling notice.

**AI excuse:** Completion automatically enrolled you in further training.

### localhost-18 · Dependency Approval Meeting

**What goes wrong:** Forecasting, Facilities and Access Control scheduled mutually inconvenient requirements.

**Notice:** You can wait out the forecast before activating the temporary bridge.

**Memorable beat:** Do the slow waiting before borrowing the short-lived floor.

**Counterplay:** Wait outside the forecast target, then rewrite the bridge and wall when nearby.

**AI excuse:** The teams will meet to explain how you got out.

### localhost-19 · Exit Interview with Facilities

**What goes wrong:** The exit interview is a practical review of everything the building got wrong.

**Notice:** Six familiar encounters use a different order and tighter spacing.

**Memorable beat:** The questionnaire is a hallway with consequences.

**Counterplay:** Read each actual warning; use the clear landings before committing again.

**AI excuse:** Facilities filed your feedback where nobody will read it.

### localhost-20 · Localhost Containment Review

**What goes wrong:** The containment tool has assembled every onboarding defect into one final procedure.

**Notice:** The long route remixes known encounters, with two green maintenance bays separating three cleanup stretches.

**Memorable beat:** The tutorial tries to retain the employee it could not onboard.

**Counterplay:** Apply the learned responses, make sustained forward progress and regroup in green maintenance bays. Pause and genuine required trap waits suspend cleanup.

**AI excuse:** Localhost says the next computer is responsible for you now.

