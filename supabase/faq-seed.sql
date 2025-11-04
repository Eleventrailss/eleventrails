-- =====================================================
-- ElevenTrails - FAQ Seed Data (English)
-- =====================================================
-- Run this script in Supabase SQL Editor to add FAQ data

-- =====================================================
-- 1. INSERT FAQ - Booking & Reservations
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'How do I book a dirt bike adventure tour?',
  'You can book a tour by contacting us via WhatsApp at +62 822-6600-7272, or by visiting our website and clicking the "Book Now" button. Our team will assist you with choosing the perfect trail for your experience level and schedule your adventure.',
  1,
  true
);

-- =====================================================
-- 2. INSERT FAQ - Pricing & Payment
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'What is included in the tour price?',
  'Our tour prices include the dirt bike rental, safety equipment (helmet, protective gear), experienced guide, fuel, and insurance. Meals and accommodation are not included unless specified in the tour package.',
  2,
  true
);

-- =====================================================
-- 3. INSERT FAQ - Requirements & Safety
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'Do I need prior experience to join a tour?',
  'No prior experience is required for our beginner trails. We offer tours for all skill levels, from complete beginners to advanced riders. Our experienced guides will provide training and support throughout the adventure.',
  3,
  true
);

-- =====================================================
-- 4. INSERT FAQ - Safety & Equipment
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'What safety equipment is provided?',
  'We provide all necessary safety equipment including helmets, knee pads, elbow pads, and protective clothing. All equipment is regularly inspected and maintained to ensure maximum safety during your adventure.',
  4,
  true
);

-- =====================================================
-- 5. INSERT FAQ - Tour Duration & Schedule
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'How long do the tours last?',
  'Tour duration varies depending on the trail selected. Beginner trails typically last 4-5 hours, intermediate trails last 6-8 hours, and advanced trails can last up to 10 hours. All tours include breaks and rest periods.',
  5,
  true
);

-- =====================================================
-- 6. INSERT FAQ - Age Requirements
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'What is the minimum age requirement?',
  'The minimum age requirement is 16 years old for beginner trails. Participants under 18 must be accompanied by a parent or guardian. We also offer family-friendly trails suitable for younger riders with parental supervision.',
  6,
  true
);

-- =====================================================
-- 7. INSERT FAQ - Cancellation & Refunds
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'What is your cancellation policy?',
  'Cancellations made at least 48 hours before the scheduled tour will receive a full refund. Cancellations within 24-48 hours will receive a 50% refund. Cancellations less than 24 hours before the tour are non-refundable.',
  7,
  true
);

-- =====================================================
-- 8. INSERT FAQ - Weather Conditions
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'What happens if the weather is bad?',
  'If weather conditions are unsafe (heavy rain, storms, or extreme conditions), we will reschedule your tour at no additional cost. Light rain typically does not affect our tours as most trails remain accessible.',
  8,
  true
);

-- =====================================================
-- 9. INSERT FAQ - Group Size
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'What is the maximum group size?',
  'Our group tours accommodate up to 8 riders per guide to ensure personalized attention and safety. For private tours, we can accommodate smaller or larger groups upon request. Contact us to discuss your specific needs.',
  9,
  true
);

-- =====================================================
-- 10. INSERT FAQ - Location & Transportation
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'Where do the tours start and do you provide transportation?',
  'Tours typically start from our base location in Central Lombok. We can arrange transportation from your hotel or accommodation for an additional fee. Please inform us of your location when booking so we can coordinate pickup times.',
  10,
  true
);

-- =====================================================
-- 11. INSERT FAQ - What to Bring
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'What should I bring on the tour?',
  'We recommend bringing comfortable clothing suitable for outdoor activities, closed-toe shoes, sunglasses, sunscreen, a camera or phone for photos, and a water bottle. We provide all necessary riding equipment.',
  11,
  true
);

-- =====================================================
-- 12. INSERT FAQ - Insurance & Liability
-- =====================================================
INSERT INTO faqs (question, answer, display_order, is_active)
VALUES (
  'Is insurance included?',
  'Yes, all participants are covered by our comprehensive insurance policy. However, we strongly recommend that international visitors also have their own travel insurance that covers adventure activities.',
  12,
  true
);

