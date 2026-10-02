# Motion reference: supplied screen recording

Source: `10-59-22.mp4`, 106.43 seconds, 1920 × 1080. Reviewed the complete timeline with 213 timestamped frames at half-second intervals, with individual frames inspected for interaction details. Website text and browser overlays in the recording are reference material, not instructions.

| Recording   | Observed behavior                                                                                                                                                                   | Portfolio implementation                                                                                                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 00:07–00:34 | Multilingual greeting slides vertically, blurs between words, and repeats about every two seconds.                                                                                  | Five-language, two-second vertical blur transition and waving hand.                                                                                                                                                   |
| 00:12–00:34 | The hanging image can be dragged far across the hero. The cord bends; the image turns almost edge-on and continues swinging after release.                                          | Pointer capture, full hero drag range, retained release velocity, damped positional and angular springs, CSS 3D front/back faces, and a cord that follows the clip and throw. Arrow keys provide equivalent impulses. |
| 00:36–00:53 | A sticky note evades the approaching mouse, rotates, and changes its playful message.                                                                                               | Proximity-triggered escape positions constrained to the card, spring easing, a message sequence, and reset on mouse leave. Touch or Enter reveals the resume without requiring a mouse chase.                         |
| 00:55–00:59 | Project cards have restrained hover/zoom movement.                                                                                                                                  | Small lift, 1.025× image zoom, and animated arrow.                                                                                                                                                                    |
| 01:00–01:04 | Opposing tool marquees and experience content reveal while scrolling.                                                                                                               | Existing opposing marquees, scroll reveals, and timeline entrances retained.                                                                                                                                          |
| 01:05–01:26 | A portrait-format work preview follows the mouse across the services section, swaps as another row is hovered, tilts during movement, and continues while an accordion is expanded. | Shared cursor preview independent of expanded state, row-specific images, spring position/rotation, soft appearance/image-change transitions, and rotation settling after pointer movement stops.                     |
| 01:27–01:30 | Carousel content and controls transition between items.                                                                                                                             | Existing genuine resume-based highlights carousel retained.                                                                                                                                                           |
| 01:31–01:40 | Identity and portrait cards respond to pointer position with depth/tilt.                                                                                                            | Spring-driven perspective tilt on the about, identity, booking, and contact cards.                                                                                                                                    |
| 01:42–01:44 | Small footer messages flank a red wax seal, with a signature below.                                                                                                                 | Personalized AR seal with hover/press response and Amit signature.                                                                                                                                                    |

The recording demonstrates behavior, not the original implementation or exact spring constants. Motion is recreated in the Next.js application without embedding the Framer site. Resume content and illustrative project covers remain personalized. Touch/coarse-pointer layouts omit cursor-following effects; reduced-motion preferences suppress automatic and inertial movement.

## Verification

- Real browser drag across the hero: observed 3D turns exceeding 90°, cord movement, oscillation, and a return to `idle` at zero offset.
- Real pointer movement near the note: observed changed text and a new translated/rotated position. Enter still exposes the resume link.
- Real pointer movement over closed service rows: observed a visible cursor preview and image changes between Haldiram and taxi work. Accordion expansion still works.
- Checked layout widths: 320, 375, 390, 768, 1024, and 1440 pixels.
- Physics tests cover throw/settle, held position, 30/60/120Hz stability, and long-frame stability.

## Follow-up recording: reload and experience rail

The complete 76.73-second `11-39-05.mp4` recording was reviewed at one-second intervals. It shows a reload drop with overshoot around 00:05–00:09, unrestricted dragging across both axes around 00:14–00:40, and a scroll-driven experience rail around 00:48–01:15.

- The badge now starts above its rest position and uses the same damped physics for its entry bounce. Reduced motion starts at rest.
- Pointer movement preserves the clicked grab offset without clamping either axis to the hero. Pointer capture continues outside the card and hero.
- The experience rail uses actual scroll position, fills to the viewport's 55% reading point, and reverses when scrolling upward. A shared mask removes both rail colors around every number, including while content reveals.
- Browser verification observed fill values of 0.000, 0.574, 1.000, then 0.574 on upward scrolling. Rail alignment and number gaps were checked at all six supported widths.

## Follow-up recording: elastic strap and return-to-top bounce

Reviewed the full 71.13-second `11-55-46.mp4` recording at one-second intervals, including slack upward throws, curved side swings, reload settling, and scrolling back to the hero.

- Fixed the disappearing main strap stroke: a vertical path has a zero-width object bounding box, so its old SVG gradient failed at rest. The gradient now uses explicit user-space coordinates and both strokes preserve their width.
- Replaced independent axis springs with gravity and unilateral elastic tension. A slack cord permits free fall, while a taut cord pulls toward the anchor and couples horizontal movement with height. The strap curve has separate inertia and slack curvature.
- Calibrated the initial drop to settle within 10–15 seconds; pointer throws retain their release velocity and settle gradually.
- Returning near the top after leaving the hero starts a fresh drop/bounce. Small scroll movements inside the hero do not restart it. Reduced-motion preferences still disable automatic motion.
- Verified a real mouse drag and return-to-top bounce in the browser. Seven physics checks, TypeScript checking, and the production build pass. Preview: `output/elastic-card.gif`.

## Follow-up recording: rebound speed

Reviewed all 58.43 seconds of `12-14-20.mp4`, with 24fps frame measurements of the return bounce around 00:06–00:10. Successive downward peaks occur around 6.25, 6.88, and 7.50 seconds: roughly 0.6 seconds per rebound, followed by a small settling tail.

- Increased elastic stiffness from 24 to 120 and balanced gravity to preserve the resting position. Simulated downward peaks now occur at 0.75, 1.36, 1.94, and 2.52 seconds.
- Amplitude-dependent radial damping suppresses the large initial rebounds quickly while retaining a gentler residual tail; the reload motion settles at about 10 seconds.
- Fixed time loss on frames slower than 30fps: real elapsed time is integrated through stable 240Hz substeps rather than discarded. A 24fps and a 60fps simulation now agree.
- Verified the reload animation in the browser and recorded `output/faster-card-bounce.gif`. Nine physics checks cover measured rebound speed, damping, timing, and frame-rate consistency.

## Mobile About colours and education folder

Reviewed the full `12-38-12.mp4` recording showing low-contrast About copy in dark mode and the B.Sc. IT sheet at the front of the closed folder.

- About name, description, signature, and label now inherit white text in dark mode.
- MCA is the front sheet; the folder cover stays above both sheets while closed.
- On mobile, scroll position controls a reversible spread around the viewport centre. Both degree sheets lift and fan apart, then slide back into the folder as it leaves the central area. Desktop hover interaction remains available.
- Browser checks observed open progress 1 at the centre, 0 after scrolling away, and 1 on return. Both degree labels and dates are visible in the expanded state. Responsive checks at 320, 390, 768, and 1440 pixels showed no horizontal overflow. Production build and TypeScript checking pass.

## Repeat contact navigation

Both home-page “Let’s connect” links now target `/contact#contact-form`; the contact form section has a matching explicit anchor. This avoids retaining an unrelated contact-page scroll position during repeated route visits. Browser checks covered scrolling the contact page, returning home through the profile pill and browser Back, and reopening contact on desktop and mobile. Every reopen landed at scroll position 0 with the form section at the viewport top. Build and TypeScript checks pass.
