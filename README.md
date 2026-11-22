
# Palm Leaf House Archive

## 1. What This Is

Palm Leaf House Archive is a bilingual digital collection that documents traditional Cambodian palm-leaf houses and the knowledge behind their construction and maintenance. The project preserves practical knowledge gathered through conversations with my grandmother, a neighbor who is also a grandmother, and elders from different Cambodian provinces. It covers topics such as palm-leaf preparation, weaving techniques, roof and wall covering, house construction, traditional house types, and maintenance. The archive currently contains eight curated entries in Khmer and English. Visitors can browse and search the collection without creating an account, while registered community members can contribute their own knowledge and photographs for review before publication.

**Live Website:** https://palm-tree-gilt.vercel.app/

## 2. Who It's For

The archive is designed for people in Cambodia who want to learn about, preserve, or share traditional knowledge related to palm-leaf houses. This includes younger generations who may have limited experience with traditional building techniques, as well as community members who still practice or remember these methods.

The design focuses on the needs of local users:

- **Khmer and English support:** Users can switch between Khmer and English. The interface, archive content, topic names, and image descriptions support both languages.
- **Mobile-first experience:** The layout uses responsive CSS to support browsing on smartphones, making the collection accessible to users who primarily access the internet through their phones.
- **Accessible content:** Entries are organized into clear topics so visitors can explore traditional knowledge without needing technical knowledge or an account.
- **Community contributions:** Registered users can submit written knowledge and photographs, allowing the archive to grow beyond its original eight entries.
- **Source acknowledgment:** Knowledge is credited using anonymous or role-based descriptions when contributors prefer not to have their names published.

The project also includes a self-hosted Noto Sans Khmer font to support Khmer text rendering. Although the website is designed to work on smaller screens, it does not currently provide a dedicated offline mode or a specialized low-bandwidth mode.

## 3. How It Works

### Technology Stack

The application uses the following technologies:

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework and routing |
| React 19 | User interface |
| JavaScript | Application logic |
| Tailwind CSS and CSS | Styling and responsive layouts |
| Supabase | Authentication, PostgreSQL database, Row Level Security, and photo storage |
| Vercel | Application hosting and deployment |
| GitHub | Source code management |

The application is built with Next.js App Router and deployed on Vercel. Supabase handles user authentication, database operations, access permissions, and contribution photo storage.

### Database Structure

The main tables and storage resources include:

- **entries:** Stores curated and community-submitted archive entries, including titles, descriptions, owner IDs, photographs, publication status, and review information.
- **profiles:** Stores user profile information and application roles linked to Supabase Auth.
- **super_admins:** Maintains the allow-list used to identify authorized archive administrators.
- **photos (Supabase Storage):** Stores photographs uploaded by contributors.

The migration history also includes reference tables for topics, categories, people, stories, techniques, and galleries, together with relationship tables.

The original curated archive content is maintained in JavaScript data files, including `data/entry-content.js`, while community contributions are managed through the Supabase `entries` table.

### Entry Status and Workflow

Every community submission follows one of three statuses:

| Status | Description |
|---|---|
| `pending` | A newly submitted entry or an entry awaiting review. It is not publicly visible. |
| `published` | An approved entry that can be viewed by public visitors. |
| `returned` | An entry sent back to its contributor with a review note explaining the requested changes. |

The general workflow is:

1. **Visitors:** Anyone can browse and search published entries without creating an account.
2. **Contributors:** Registered users can submit new entries with text and photographs.
3. **Review:** New submissions enter the `pending` status and appear in the administrator's review queue.
4. **Publication:** The administrator reviews each submission and either publishes it or returns it with feedback.
5. **Revision:** Contributors can edit their own submissions. Editing a returned or published entry sends it back to `pending` for another review.

### Access Control

Row Level Security (RLS) is enabled on the `entries` table to control database access.

The main access rules are:

- Anonymous visitors can read published entries only.
- Authenticated contributors can read their own submissions.
- Contributors can insert entries using their own authenticated user ID.
- Contributors can update and delete only their own eligible entries.
- Editors and administrators have additional permissions for archive management.
- Moderation fields and status changes are protected from unauthorized modifications.
- Users cannot change their own roles to obtain elevated permissions.

These permissions are enforced through Supabase policies, database triggers, and application-level authorization checks.

## 4. Security Decisions

Security was an important part of the contribution and review workflow because users should not be able to publish their own submissions or modify another contributor's content without authorization.

### Review and Publication Protection

The current implementation handles moderation through the API route:

`app/api/admin/contributions/route.js`

When an administrator reviews a submission, the route:

1. Checks the request origin.
2. Verifies the authenticated user's identity and role.
3. Validates the requested moderation action and return note.
4. Performs the database update through the Supabase server client.

The review page also checks the user's role before loading the review queue.

However, hiding or disabling the Publish button is not sufficient security. A user could still attempt to send a request manually through the browser console or another client. Therefore, the actual protection comes from server-side authorization, database RLS policies, and triggers that prevent unauthorized changes to moderation fields.

### Why the Review Logic Is Protected

The current repository does not contain a database function named `review_entry`. Instead, moderation is implemented through the API route, together with database-level access restrictions.

An earlier development approach considered using a Supabase RPC function. The final implementation uses the API route and database protections described above. This README documents the implementation currently present in the repository rather than an earlier development plan.

### Additional Security Decisions

- **Returned submissions:** When an entry is returned, the contributor can see the reviewer's note and make the requested corrections. Saving the revised entry sends it back to `pending` for another review.
- **Published entry revisions:** Contributors are allowed to revise their own published entries, but the revised version must go through the review process again before becoming public.
- **Ownership protection:** Contributors cannot edit or delete entries belonging to other users. Database policies enforce ownership using the authenticated user's UUID.
- **Role protection:** Regular users cannot assign themselves an editor or administrator role.
- **Photo visibility:** Contribution photographs are stored in the public `photos` bucket. Therefore, a photograph's URL may be accessible even while its entry is pending review. The application informs contributors about this when they submit photographs.

These decisions help protect the archive's content while allowing community members to participate in preserving traditional knowledge.

### Verification

The following local verification commands completed successfully:

- `npm run lint` — completed without reported errors.
- `npm test` — all 111 tests passed.
- `npm run build` — production build completed successfully.

The repository also includes an ownership verification script:

`npm run test:ownership`

This script requires two configured test accounts to verify ownership restrictions.

## 5. AI Use

AI tools were used throughout development as coding assistants, debugging support, and review tools. I used Cline in VS Code with models accessed through OpenRouter, as well as ChatGPT, to help develop and improve the application.

The following models and tools were recorded during development:

| Model / Tool | Main Purpose | How I Used the Output |
|---|---|---|
| Gemini 2.5 Flash | Initial development and feature implementation | Reviewed and adjusted generated code to fit the project requirements. |
| Gemini 3.5 Flash-Lite | Development assistance and smaller coding tasks | Used suggestions as a starting point and checked the resulting changes. |
| OpenAI GPT-5.1 Codex | Coding assistance | Reviewed proposed code and made adjustments where needed. |
| DeepSeek Flash Latest | Coding and debugging assistance | Tested generated changes and corrected issues when they appeared. |
| OpenRouter Free | Access to available AI models during development | Used as part of the development workflow through Cline. |
| Claude Haiku 5.5 | Final project review and verification | Used to scan the project, identify potential problems, and check features against the project requirements. |
| ChatGPT | Writing, planning, debugging explanations, and documentation | Used suggestions to improve explanations, review decisions, and prepare project documentation. |

### How AI Contributed to the Project

AI assistance was used in several parts of development:

- **Application structure:** Helped establish the initial page structure, navigation, and archive browsing experience.
- **Bilingual content and interface:** Assisted with interface text, search messages, empty states, and other user-facing content. I reviewed and adjusted the wording to fit the archive.
- **Supabase integration:** Assisted with authentication, database queries, and the contribution workflow.
- **Security implementation:** Helped investigate RLS policies, ownership restrictions, and administrator review permissions.
- **Debugging and testing:** Helped identify potential problems and suggest fixes during development.
- **Final review:** Claude Haiku 5.5 was used to examine the project against its requirements and identify issues that needed further checking.

### Human Review and Verification

I did not treat AI-generated code or suggestions as automatically correct. I reviewed the changes, compared them with the intended functionality, and tested the actual application before keeping them.

For example, during development, an AI suggestion used an outdated Supabase environment variable name. I corrected the configuration to use the publishable-key variable required by the current project setup and checked that a secret key was not exposed in the frontend.

I also encountered suggestions that did not match the intended database review workflow. Rather than following them without checking, I compared the suggestions with the existing API routes, database policies, and actual implementation.

For the final review, I used Claude Haiku 5.5 to scan the project and identify potential problems against the requirements. I then reviewed the findings and checked the relevant implementation and application behavior before deciding whether any changes were necessary.

AI helped speed up development, but the final implementation decisions, adjustments, and verification remained part of my work.

## 6. Sources and Credits

The knowledge in this archive comes from both community conversations and external research materials. I wanted to preserve traditional knowledge shared by people in my community while also referring to existing publications and visual resources about Cambodian traditional houses and palm-leaf construction.

### Community Sources

The main knowledge contributors include:

- My grandmother, who shared traditional knowledge and experiences related to palm-leaf houses.
- A neighbor who is also a grandmother, who contributed knowledge about traditional practices.
- Elders from different Cambodian provinces who shared information about traditional house construction and maintenance.

Their names are not published because I want to respect their privacy. Their contributions are acknowledged through anonymous or role-based credits in the archive.

The eight curated entries cover:

1. Palm-leaf preparation.
2. Leaf weaving and cross-weaving techniques.
3. Roof-frame construction.
4. Techniques for tying palm-leaf panels.
5. Seasonal roof repair.
6. A traditional family house in Kampong Speu Province.
7. Drying palm-leaf panels.
8. Traditional thatching tools.

### External Research and Reference Materials

The following online resources were consulted as references during the development of the archive:

1. **Yosothor – សម្ភារៈប្រក់ដំបូល (Traditional Roofing Materials)**

   Author: ព្រាប ចាន់ម៉ារ៉ា

   This Khmer-language article discusses traditional materials used for Cambodian roofs, including palm leaves, thatch, and other natural materials.

   Source: https://www.yosothor.org/publications/khmer-renaissance/chapter-five/samphearak-brok-dombul.html

2. **YouTube Video Reference 1**

   Video: https://www.youtube.com/watch?v=_KdY5LXeQ9k

3. **YouTube Video Reference 2**

   Video: https://www.youtube.com/watch?v=r7i4pDAH3iU

4. **CNC News – Conservation of Cambodian Palm Trees**

   This Khmer-language news article discusses the conservation and expansion of Cambodian palm tree cultivation, as well as the importance of preserving traditional knowledge and practices associated with palm trees.

   Source: https://www.cnc.com.kh/detail/news/40196

5. **Additional Image Reference**

   Image reference: https://encrypted-tbn0.gstatic.com/images?q=ANd9GcTkIgChv3O-OCpw6AN4RWhPE69g9mqKG3GxPCSMD2mHpiLhDpQbMTr1p6A&s=10

### Photograph Credits

The photographs were obtained from online references to illustrate traditional houses, construction techniques, and related materials.

The available links above document some of the visual references used during development. However, the direct image link does not identify its original creator or original publishing website. The original creators and reuse permissions for some online photographs have not been fully verified.

I acknowledge this as a limitation of the current collection and aim to maintain proper attribution for external materials.

## 7. Running It Locally

### Requirements

- Node.js
- npm
- Git
- A Supabase project with the required database configuration

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/sreytim/palm_tree.git
cd palm_tree
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env.local` file in the project root based on `.env.example`.

The application requires:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Add the corresponding values from your Supabase project to your local environment file.

Never commit environment values, passwords, service-role keys, or other private credentials to GitHub. The publishable Supabase key is designed to be used in the frontend; database access must still be protected through RLS and other security controls.

**4. Start the development server**

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

### Useful Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the development server. |
| `npm run lint` | Checks the project for linting issues. |
| `npm test` | Runs the automated test suite. |
| `npm run build` | Creates a production build. |
| `npm run start` | Starts the production server. |
| `npm run test:ownership` | Runs ownership verification using two configured test accounts. |

The ownership test additionally requires the following environment variables:

- `SPRINT2_ACCOUNT_A_EMAIL`
- `SPRINT2_ACCOUNT_A_PASSWORD`
- `SPRINT2_ACCOUNT_B_EMAIL`
- `SPRINT2_ACCOUNT_B_PASSWORD`

Use dedicated test accounts and keep their credentials in an ignored local environment file.

## 8. Submission Checklist

- [x] Live URL loads logged out and shows published entries only: yes, https://palm-tree-gilt.vercel.app/
- [x] A stranger cannot publish their own entry through the page or the console: yes, tested multiple times; last verified November 22, 2026.
- [x] Logged out, the API returns nothing pending or returned: yes, tested multiple times; last verified November 22, 2026.
- [x] Contributors can edit and delete only their own entries: yes, verified through RLS policies and automated tests.
- [x] No secrets anywhere in the repo history: yes, checked with Gitleaks (`gitleaks git . --verbose`); 130 commits scanned, approximately 9.36 MB checked, no leaks found.
- [x] At least eight real entries, each with a credited source: yes, 8 curated entries with anonymous or role-based source credits.
- [x] Khmer renders on every screen a user meets, including the queue: yes.
- [x] Works at phone width: yes, tested on a mobile device, iPhone 15 Pro.
- [x] No test entries, lorem ipsum or TODO comments in shipped pages: yes.
- [x] No console errors on the main pages: yes.
- [x] jesseorndorff is a collaborator on this repo: yes.
- [x] Supabase project restored and awake on November 22, 2026.
- [x] Demo video link opens in a private window: yes, https://youtu.be/qwdrtMaACaE
- [x] Reflection pasted in the Canvas submission: yes.
- [x] Posted in the Show Your Archive discussion: yes.
- [x] Q&A slot booked for Friday, December 4, 2026, 1:50 PM–1:55 PM.
