# Project Implementation Guidelines

## Phase 1: Landing Page & University Grid
- Create a hero section with a "Next-level" clean aesthetic.
- Implement a **University Grid Section** featuring logos of major Sri Lankan Universities:
  - University of Kelaniya, Moratuwa, Colombo, Peradeniya, Sri Jayewardenepura, Ruhuna, Jaffna, Rajarata, Sabaragamuwa, Eastern, South Eastern, Wayamba, UWU, Open University, SLIIT, NSBM, KDU.
- UI Requirement: Hover effects on university cards that show the number of active listings in that area.

## Phase 2: Unified Posting System
- Build a single "Create Post" modal or page.
- Fields for **Offering a Space**: Location, Price (LKR), Gender Preference (Male/Female/Any), Distance to Uni, Photos, Phone Number.
- Fields for **Requesting a Space**: Target University, Budget Range, Move-in Date, Contact Info.
- **Naming Convention:** Use "I have a Space" and "I'm looking for a Space."

## Phase 3: Search & Discovery
- Implement a search bar on the landing page targeting University names.
- Listing cards must display: Price, Distance to Campus, and "Verified" status (if applicable).
- Use Next.js Server Components to fetch and render listings for instant SEO indexing.

## Phase 4: Google Auth Integration
- Single "Sign in with Google" button in the navbar.
- On first login, capture user name, email, and profile picture from Google.
- Store users in the `users` collection.

## Phase 5: Styling Guidelines
- **Typography:** Use a clean Sans-serif (Inter or Geist).
- **Cards:** Use `backdrop-blur-md` and `bg-white/80` for a glassmorphism feel on light mode.
- **Buttons:** Gradient transitions on hover for a "premium" feel.