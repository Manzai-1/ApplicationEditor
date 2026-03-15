## Codebase conventions
### Architecture
- Frontend never talks directly to Supabase for data
- All data flows through the Express API
- Auth: Supabase handles authentication (login, signup, OTP verification), Express validates tokens and issues HTTP-only session cookies
- Frontend calls Supabase Auth directly → on success, sends token to Express → Express sets cookie → subsequent API calls authenticated via cookie

### Auth Flow
```
Registration:  signUp() → /verify page → verifyOtp() → POST /api/auth/session → cookie set → home
Login:         signInWithPassword() → POST /api/auth/session → cookie set → home
Password Reset: resetPasswordForEmail() → /verify → verifyOtp() → /reset-password → updateUser()
OAuth:         signInWithOAuth() → callback handled by Supabase → POST /api/auth/session → home
```

### Structure
```
src/
  pages/          — assembles features/components, owns page-level state
  features/       — self-contained feature slices
  components/     — shared UI primitives
    ui/           — shadcn components (Button, Dialog, etc.)
  hooks/          — shared hooks (useAuth, etc.)
  lib/            — utilities, supabase client
  services/       — all API calls to Express backend
  types/          — shared TypeScript types
  styles/
    globals.css   — Tailwind + CSS variables (theming source of truth)
```
Each page, feature, or component is a flat folder:
```
features/ApplicationList/
  ApplicationList.tsx
  useApplicationList.ts
  applicationListTypes.ts   — only if types aren't shared
```
### Styling
- `globals.css` holds CSS variables — no hardcoded color values in components
- No CSS modules
### Imports
Always use path aliases, never relative paths. Aliases defined in `vite.config.ts` and `tsconfig.json`.
### Patterns — point to files, don't describe
*Update these paths as examples are created:*
- Feature pattern: `src/features/ApplicationList/`
- Page pattern: `src/pages/ApplicationsPage/`
- API service pattern: `src/services/applications.ts`
- Hook pattern: `src/features/ApplicationList/useApplicationList.ts`
- Auth hook: `src/hooks/useAuth.tsx`
- Auth service: `src/services/auth.ts`
- Supabase client: `src/lib/supabase.ts`
---
## Working rules
- One file, one concern. Never combine unrelated logic.
- Parent orchestrates children. No A → B → C chains. Parent calls A, uses return to call B, etc.
- State lives in the parent. Children receive data and callbacks as props.
- Build one piece at a time. Verify it works. Then move on.
- DRY and KISS. Explicit over implicit. Name things clearly.
- Before writing code: state your approach in 1–2 sentences and wait for acknowledgement.
- If my approach has a structural flaw: tell me directly and explain why.
- If I won't understand something you wrote: explain it. I want to learn.
- Ask if an instruction is ambiguous. Do not guess and build the wrong thing.
- Do not add unrequested abstractions, error handling, or logging without flagging them.
- No comments unless something would be genuinely confusing without one.
- Components without logic don't need a hook file.
- shadcn/ui components in `components/ui/` — edit them freely as needed.