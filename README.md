# SahaSeva Connect

BUILD SAHASEVA – COMPLETE FULL-STACK MOBILE-FIRST APPLICATION

Build a complete, polished, production-style mobile-first full-stack application called SahaSeva – Cooperative Gig Services Platform for Problem Statement ID 26089: Cooperative Gig Services Platform for Household & Community Services.

This is not just a landing page or static UI. Build a complete functional prototype with frontend, backend, database, authentication, role-based dashboards, realistic workflows, responsive mobile UI, AI-assisted features, geo-location features, payments/invoices, worker welfare, cooperative management, notifications, ratings, complaints, analytics and security architecture.

The application should feel like a modern professional Indian service marketplace while clearly differentiating itself through its cooperative-owned worker ecosystem, fair wages, worker welfare and cooperative/federation management.

---

1. PRODUCT NAME

SahaSeva

Tagline:

“Trusted Services. Empowered Workers. Stronger Communities.”

Alternative supporting message:

“Connecting communities with verified cooperative workers.”

Use a clean, modern, trustworthy visual identity.

---

2. CORE PURPOSE

SahaSeva is a cooperative-owned digital marketplace connecting:

Customers

- Household customers

- Families

- Senior citizens

- Students/working people

- Small businesses

- Shops

- Restaurants

- Offices

- Schools

- Clinics

- Hospitals

- Government/local institutions

- NGOs

- Cooperative societies

- Community organizations

with

Verified Cooperative Workers

- Electricians

- Plumbers

- Carpenters

- Painters

- Cleaners

- Domestic helpers

- Caregivers

- Drivers

- Gardeners

- Appliance technicians

- Repair technicians

- Construction/maintenance workers

- Other skilled and semi-skilled workers

Workers must belong to a registered Labour Cooperative Society/Federation.

---

3. MAIN DIFFERENTIATOR

Do NOT design SahaSeva as a generic Urban Company clone.

The platform must clearly emphasize:

- Cooperative ownership

- Verified cooperative workers

- Fair wages

- Worker welfare

- Insurance

- Skill certification

- Transparent pricing

- Consumer trust

- Local employment

- Rural + semi-urban + urban coverage

- Emergency services

- AI-based demand forecasting

- AI workforce allocation

- Cooperative Society management

- Federation-level management

---

4. USER ROLES

Implement these roles:

1. CUSTOMER

2. WORKER

3. SOCIETY_ADMIN

4. FEDERATION_ADMIN

5. SUPER_ADMIN

Each role must have a separate dashboard and permissions.

Use proper Role-Based Access Control (RBAC) on both frontend and backend.

Never rely only on hiding frontend buttons for security.

---

5. AUTHENTICATION

Implement:

- Login

- Registration

- Logout

- Password reset

- Secure password hashing

- Email/mobile verification where practical

- Secure sessions/tokens

- Session expiry

- Protected routes

- Role-based redirects

Login flow:

User enters email + password

        ↓

Backend authenticates user

        ↓

Verify password hash

        ↓

Get user role

        ↓

Create secure session/token

        ↓

Redirect to role dashboard

Roles:

CUSTOMER → Customer Dashboard

WORKER → Worker Dashboard

SOCIETY_ADMIN → Society Dashboard

FEDERATION_ADMIN → Federation Dashboard

SUPER_ADMIN → Super Admin Dashboard

Do NOT store plaintext passwords.

Do NOT provide public registration for Super Admin.

---

6. USER DATABASE

Create a proper database structure.

Core users table:

users

----------------

id

name

email

mobile

password_hash

role

profile_photo

preferred_language

address

location

status

created_at

updated_at

Use appropriate additional tables/entities instead of putting everything into one table.

---

7. CUSTOMER REGISTRATION

Customer registration fields:

- Full name

- Mobile number

- Email

- Password

- Profile photo optional

- State

- District

- Mandal/Town

- Village/Area

- Pincode

- Landmark

- GPS location permission

- Preferred language

Allow both:

Use Current Location

and

Enter Address Manually

Customer can later save multiple addresses.

---

8. WORKER REGISTRATION

Worker registration fields:

- Full name

- Mobile

- Email

- Password

- Profile photo

- Address

- State

- District

- Mandal/Town

- Village/Area

- Pincode

- GPS location

- Service category

- Skills

- Experience

- Certificates/qualifications

- Cooperative Society

- Cooperative membership ID

- Identity/KYC information

- Availability

- Working hours

- Languages

- Service area/radius

- Bank/payment information

Worker registration flow:

Registration

     ↓

Identity Verification

     ↓

Cooperative Membership Verification

     ↓

Skill Verification

     ↓

Certificate Verification

     ↓

Society/Admin Review

     ↓

Approved

     ↓

Worker Dashboard

Until approval, show:

Pending Verification

---

9. ADMIN ACCOUNT

Super Admin must NOT be created through public signup.

Use secure seeded/pre-created admin accounts or controlled admin creation.

Admin levels:

SUPER_ADMIN

     ↓

FEDERATION_ADMIN

     ↓

SOCIETY_ADMIN

     ↓

WORKER

Customer and worker accounts must have restricted access.

---

10. CUSTOMER HOME DASHBOARD

Create a beautiful mobile-first customer home screen.

Top:

- Greeting

- Customer name

- Current/selected location

- Notifications

- Profile icon

Main search:

“What service do you need?”

Popular services:

- Electrical

- Plumbing

- Carpentry

- Painting

- Cleaning

- Caregiving

- Driving

- Gardening

- Repair & Technician

- Domestic Services

- Construction & Maintenance

- View All

Add:

Emergency Service Card

“Need a service urgently?”

Button:

Book Emergency Service

---

11. AI CUSTOMER SERVICE ASSISTANT

Add an AI-assisted search/assistant.

Customer can type naturally:

«“My kitchen tap is leaking.”»

AI maps it to:

Plumbing

→ Tap Repair

Another example:

«“Fan is making noise.”»

AI suggests:

Electrical

→ Fan Inspection/Repair

The AI should assist with service categorization and booking.

Do NOT make medical, electrical safety or other dangerous technical diagnoses.

---

12. SMART SERVICE SEARCH

Customer can search by:

- Service

- Subservice

- Location

- Availability

- Price

- Rating

- Experience

- Verification

- Distance

Support:

List View

and

Map View

---

13. SERVICE CATEGORIES

Create realistic categories and subservices.

Electrical

- Fan installation

- Fan repair

- Light installation

- Switch/socket repair

- Wiring

- Basic electrical maintenance

- Inverter-related services

Plumbing

- Tap repair

- Pipe repair

- Sink/drain

- Bathroom plumbing

- Water tank

- Leakage repair

Cleaning

- Home cleaning

- Bathroom cleaning

- Kitchen cleaning

- Deep cleaning

- Office cleaning

Carpentry

- Furniture repair

- Door repair

- Shelf installation

- Basic woodwork

Painting

- Room painting

- Wall painting

- Touch-up

- Exterior/interior painting

Gardening

- Garden maintenance

- Plant care

- Lawn maintenance

Appliance & Technician

- Appliance inspection

- Installation

- Basic repair services

Also support:

- Driving

- Caregiving

- Domestic Services

- Construction & Maintenance

- Other approved cooperative services

---

14. CUSTOMER LOCATION SYSTEM

Support:

- GPS/current location

- Manual address

- State

- District

- Mandal/Town

- Village/Area

- Pincode

- Landmark

Location hierarchy must work well for:

- Rural

- Village

- Semi-urban

- Town

- Urban

- District

If no worker is available in the exact locality:

Village

 ↓

Nearby locality

 ↓

Mandal/Town

 ↓

Nearby service area

Expand matching radius intelligently.

---

15. WORKER MATCHING

Create smart worker matching based on:

- Skill

- Subservice

- Distance

- Availability

- Experience

- Rating

- Completed jobs

- Current workload

- Cooperative verification

- Service area

Show:

- Worker photo

- Name

- Service

- Verified badge

- Rating

- Completed jobs

- Experience

- Distance

- Availability

- Estimated price

- Book button

Sorting:

- Nearest

- Highest rated

- Lowest price

- Available now

- Most experienced

Filters:

- Distance

- Rating

- Price

- Availability

- Experience

- Verification

---

16. WORKER PROFILE

Create a detailed professional worker profile.

Show:

- Photo

- Name

- Worker ID

- Rating

- Completed services

- Experience

- Skills

- Services

- Cooperative Society

- Languages

- Service area

- Availability

- Service charges

- Reviews

Verification badges:

- Identity Verified

- Skill Verified

- Certificate Verified

- Cooperative Member

Show transparent trust information such as:

- Completed jobs

- Rating

- Booking completion rate

- Verified skills

- Active cooperative membership

Do NOT expose:

- KYC documents

- Password

- Bank details

- Private verification information

---

17. BOOKING FLOW

Customer booking flow:

Select Service

      ↓

Select Subservice

      ↓

Describe Problem

      ↓

Optional Photo/Video

      ↓

Select Worker

      ↓

Select Date

      ↓

Select Time Slot

      ↓

Select Address

      ↓

View Price Estimate

      ↓

Confirm Booking

Support:

- Today

- Tomorrow

- Select date

- Time slots

Support recurring bookings:

- Weekly

- Biweekly

- Monthly

- Custom

Useful for:

- Cleaning

- Gardening

- Institutions

- Offices

- Businesses

- Regular maintenance

---

18. PRICE ESTIMATION

Show transparent pricing.

Example:

Service Charge       ₹300

Estimated Materials  ₹100

Cooperative Fee       ₹20

--------------------------

Estimated Total      ₹420

For variable services:

Estimated range:

₹300 – ₹500

Final amount may depend on

actual work/materials.

Never hide fees.

---

19. EMERGENCY SERVICE

Create a separate emergency booking flow.

Emergency Service

      ↓

Select Service

      ↓

Use Current Location

      ↓

Describe Problem

      ↓

Find Available Verified Workers

      ↓

Show Distance + ETA + Estimate

      ↓

Confirm Request

Emergency worker matching should prioritize:

- Current availability

- Relevant skill

- Distance

- Verified status

Example:

«Ravi Kumar

Verified Electrician

1.8 km away

ETA: 10 min

Available Now»

---

20. BOOKING STATUS

Implement booking lifecycle:

Requested

    ↓

Accepted

    ↓

On The Way

    ↓

Arrived

    ↓

In Service

    ↓

Completed

Allow:

- Reschedule

- Cancel

- Contact worker

- View booking details

Show cancellation policy before confirmation.

---

21. CUSTOMER BOOKINGS

Customer bottom navigation:

Home

Services

Bookings

Messages

Profile

Bookings tabs:

- Upcoming

- Active

- Completed

Upcoming:

- Service

- Worker

- Date/time

- Location

- Status

- Reschedule

- Cancel

- Contact

Active:

Show timeline and live status.

Completed:

- Service

- Worker

- Date

- Amount

- Invoice

- Rating

- Review

- Book Again

---

22. LIVE TRACKING

For active bookings:

Show worker:

- Map

- Distance

- ETA

- Status

Location sharing should be limited to the active booking context and protected by role-based access.

Do not publicly expose exact customer location.

Worker can navigate to customer location.

---

23. PAYMENTS

Implement payment architecture supporting:

- UPI

- Cards

- Other supported digital payment methods

- Optional cash if cooperative policy allows

For prototype, use mock/sandbox payment flow if real gateway credentials are unavailable.

Payment statuses:

- Pending

- Paid

- Failed

- Refunded

- Disputed

Generate transaction ID.

---

24. DIGITAL INVOICE

Generate a professional invoice.

Include:

- SahaSeva logo/name

- Booking ID

- Customer

- Worker

- Cooperative

- Service

- Date/time

- Service charge

- Materials

- Fees

- Total

- Payment status

- Transaction ID

---

25. FAIR WAGE SYSTEM

Create a transparent Fair Wage Indicator.

System can compare service pricing against a configurable recommended range based on:

- Service type

- Skill level

- Location

- Duration

- Local wage patterns

Example:

«⚖️ Fair Wage Check

Current worker earning is within recommended range.»

If below recommended range:

«⚠️ Price appears below recommended worker wage range.»

Admin/cooperative makes the final decision.

---

26. WORKER DASHBOARD

Worker home:

- Greeting

- Availability toggle

- Current service area

- New requests

- Today's jobs

- Completed jobs

- Today's earnings

New request card:

- Service

- Customer

- Distance

- Date/time

- Estimated price

Buttons:

Accept / Decline

---

27. WORKER JOBS

Bottom navigation:

Home

Jobs

Earnings

Welfare

Profile

Jobs tabs:

- Upcoming

- Active

- Completed

Active workflow:

Accept

 ↓

On The Way

 ↓

Arrived

 ↓

Start Service

 ↓

Complete Service

---

28. WORKER EARNINGS

Show:

- Today

- This week

- This month

- Completed jobs

- Available balance

- Pending earnings

- Paid earnings

- Deductions

- Transaction history

Show clear earnings breakdown.

---

29. WORKER CALENDAR & AVAILABILITY

Worker can:

- Set available/offline

- Set working hours

- Set working days

- Block dates

- View upcoming bookings

Prevent double booking.

---

30. WORKER SMART JOB MATCH

Add AI-assisted:

Smart Job Match

Recommend jobs based on:

- Worker skills

- Distance

- Availability

- Current workload

- Demand

- Estimated earnings

Example:

«3 suitable jobs near you»

Show reason for recommendation.

AI recommends; worker chooses.

---

31. WORKER PROFILE SETTINGS

Worker can manage:

- Personal information

- Public profile

- Skills

- Services

- Service areas

- Languages

- Availability

- Working hours

- Calendar

- Verification documents

- Certificates

- Payout details

- Notifications

- Security

Skill/certificate changes requiring verification should show:

Pending Verification

---

32. COOPERATIVE SOCIETY DASHBOARD

Each Society Admin gets its own dashboard.

Overview:

- Total workers

- Active workers

- Pending verification

- Bookings

- Earnings

- Average rating

- Welfare statistics

---

33. SOCIETY WORKER MANAGEMENT

Society admin can:

- Register workers

- Review workers

- Verify membership

- Review certificates

- Review skills

- Approve/reject/request changes

- Suspend workers according to policy

- View availability

- View performance

- View welfare status

Worker statuses:

- Pending

- Verified

- Rejected

- Suspended

---

34. SOCIETY BOOKING MANAGEMENT

Society admin can monitor:

- All society bookings

- Emergency bookings

- Active bookings

- Completed bookings

- Cancelled bookings

- Worker

- Customer

- Location

- Payment

---

35. SOCIETY FINANCE

Show:

- Total service value

- Worker payouts

- Cooperative share

- Platform fee

- Pending payments

- Refunds

- Transaction history

Example:

Customer Paid             ₹500

Worker Earnings           ₹450

Cooperative Contribution   ₹30

Platform Fee               ₹20

------------------------------

Total                     ₹500

Make the percentages configurable.

---

36. FEDERATION DASHBOARD

Federation Admin manages multiple societies.

Show:

- Total societies

- Total workers

- Active workers

- Bookings

- Transactions

- Welfare statistics

- Service demand

- District-wise performance

Hierarchy:

Federation

   ↓

District/Region

   ↓

Cooperative Societies

   ↓

Workers

Federation admins must only access societies assigned to their federation.

---

37. FEDERATION DEMAND MAP

Show map/analytics by:

- Location

- Service category

- Demand level

Levels:

🟢 Low

🟡 Medium

🔴 High

Example:

«Plumbing demand – Area A: HIGH»

---

38. SUPER ADMIN DASHBOARD

Create a professional command center.

Show:

Total Workers

Total Customers

Total Societies

Total Bookings

Emergency Requests

Transactions

Complaints

Active Users

Sections:

- Workers

- Customers

- Federations

- Cooperatives

- Bookings

- Payments

- Welfare

- Reviews

- Complaints

- AI Analytics

- Live Map

- Reports

- Settings

---

39. ADMIN WORKER VERIFICATION

Admin can review:

- Identity

- Cooperative membership

- Skills

- Certificates

Actions:

- Approve

- Reject

- Request Changes

- Suspend

Show verification history.

Certificate expiry reminders.

---

40. WELFARE SYSTEM

Create My Welfare for workers.

Cards:

Insurance

- Status

- Provider/program

- Validity

- Renewal reminder

Welfare Benefits

- Available schemes

- Eligibility

- Apply/request support

Training

- Skill-development programs

- Training recommendations

- Registration

Financial Support

- Available support programs

Documents

---

41. WELFARE SUPPORT REQUESTS

Worker can submit:

- Insurance issue

- Welfare issue

- Training

- Payment issue

- Work support

- Other

Status:

Submitted

 ↓

Under Review

 ↓

More Information / Approved

 ↓

Resolved

Admin can manage cases.

Do not expose sensitive welfare information to customers.

---

42. NOTIFICATION CENTER

Implement notification center for every role.

Types:

- Booking

- Emergency

- Payment

- Review

- Verification

- Welfare

- Cooperative announcements

- AI demand alerts

Customer:

«Booking accepted

Worker is on the way

Payment successful

Invoice ready»

Worker:

«New job request

Upcoming job

Payment received

Insurance renewal reminder»

Admin:

«Worker verification pending

Emergency request

High demand alert

Welfare issue»

Support preferred language.

Allow notification preferences.

---

43. IN-APP CHAT

Implement service-related chat:

Customer ↔ Worker

Features:

- Text messages

- Booking-linked conversation

- Basic notification

- Optional call/contact action if supported

Do not expose private phone numbers unnecessarily.

Chat should be linked to a booking.

---

44. RATINGS & REVIEWS

Only completed bookings can create reviews.

Customer can rate:

- Service quality

- Professionalism

- Punctuality

- Communication

- Overall rating

- Written review

Worker can rate customer:

- Communication

- Respect

- Booking accuracy

This creates two-sided accountability.

---

45. COMPLAINTS & DISPUTES

Customer complaints:

- No-show

- Poor service

- Wrong service

- Unexpected charge

- Behaviour

- Payment issue

- Other

Worker complaints:

- Customer unavailable

- Incorrect service information

- Payment issue

- Unsafe/unreasonable work conditions

- Other

Workflow:

Submitted

 ↓

Under Review

 ↓

Evidence/details

 ↓

Society/Admin Review

 ↓

Decision

 ↓

Resolved

AI may summarize complaint patterns but must not automatically punish users.

---

46. FRAUD MONITORING

Flag suspicious patterns:

- Fake accounts

- Suspicious ratings

- Repeated cancellations

- Payment anomalies

- Fake complaints

- Unusual booking activity

Show:

⚠️ Flagged for Admin Review

Never automatically ban based solely on AI.

---

47. AI SYSTEM

Implement AI-assisted modules:

A. Smart Worker Matching

Inputs:

- Skill

- Distance

- Availability

- Rating

- Experience

- Workload

- Verification

- Service area

B. Demand Forecasting

Predict:

- Service demand

- Location demand

- Time-based demand

- Upcoming peak periods

C. Workforce Allocation

Recommend moving/allocating available workers from lower-demand areas to nearby high-demand areas.

D. Peak Time Prediction

Identify high-demand time windows.

E. Customer AI Assistant

Natural-language service → category/subservice.

F. Worker Smart Job Match

Recommend suitable nearby jobs.

G. Admin AI Insights

Examples:

«Electrical demand expected to increase tomorrow in Area A.»

«Plumbing workers may be insufficient in Area B.»

AI must be assistive only.

Do not allow AI to make final disciplinary, payment, verification or welfare decisions.

---

48. AI DATA INPUTS

Use booking data such as:

- Service

- Location

- Date/time

- Availability

- Completion

- Ratings

- Demand

- Worker skills

For prototype, seed realistic demo data so AI analytics have meaningful charts.

If a real AI API key is unavailable, implement a realistic rule-based/mock AI service with the same interface so it can later be replaced by a real AI model.

---

49. GEOLOCATION & MAP

Implement architecture for:

- GPS

- Worker locations

- Customer locations

- Distance calculation

- ETA

- Service radius

- Matching

- Live active-booking tracking

- Demand heatmap

Map should display:

- Matching workers

- Active bookings

- Emergency requests

- Demand zones

Exact customer location must not be publicly visible.

---

50. RURAL-FIRST DESIGN

This is extremely important.

The app must work well for:

- Villages

- Mandals

- Small towns

- Semi-urban areas

- Cities

Do n

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cef3886f-2d90-42fd-8abc-b2b97b634040).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
