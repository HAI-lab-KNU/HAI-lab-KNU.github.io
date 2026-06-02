# Content Schema

This site uses Markdown frontmatter as the content database. Keep field names and value formats stable because Gatsby reads them directly through GraphQL.

## Members

Member records live in `content/members/*.md`.

### Required Fields

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `name` | string | `"Levente Szabó"` | Display name on the People page. |
| `position` | enum string | `"M.S Student"` | Must be one of the supported position values. |
| `photo` | string | `"levente-szabo-profile.jpe"` | Filename only, not a path. Use `""` only when no photo is available. |
| `research_interests` | string array | `["Neural Networks", "Robotics"]` | Use `[]` when empty. The People card displays up to 4 items. |

### Optional Fields

| Field | Type | Example | Notes |
| --- | --- | --- | --- |
| `email` | string | `"name@hai.kangwon.ac.kr"` | Empty or missing hides the email icon. |
| `date` | string | `"2026-08"` | Start month for ordering. Format: `YYYY-MM`. |
| `homepage` | string | `"https://example.com"` | Empty or missing hides the homepage icon. |
| `googleScholar` | string | `"https://scholar.google.com/..."` | Empty or missing hides the Google Scholar icon. |
| `linkedin` | string | `"https://www.linkedin.com/in/..."` | Empty or missing hides the LinkedIn icon. |
| `github` | string | `"https://github.com/..."` | Empty or missing hides the GitHub icon. |
| `bio` | string | `"Short biography"` | Stored for future use. Currently not displayed on People cards. |
| `graduation` | string | `"M.S. 2026"` | Alumni display label. Use only for alumni. |
| `current` | string | `"Company / School"` | Stored for future alumni/profile use. Currently not displayed. |

### Position Values

Use exactly one of these values:

```yaml
Professor
Ph.D Student
M.S Student
Undergraduate Student
Alumni
```

### Display And Ordering Rules

- `Professor` is displayed as `Director`.
- `Ph.D Student` and `M.S Student` are grouped under `Graduate Student`.
- Graduate students are ordered by: Ph.D before M.S, then `date` ascending, then `name` ascending.
- Existing members without `date` sort before members with later start dates because missing dates are treated as `""`.
- Alumni cards show `graduation` instead of `position` when `graduation` exists.
- `photo` resolves to `/images/members/{photo}`. The image file must exist in `static/images/members/`.

### Member Template

```yaml
---
name: "Name"
position: "M.S Student"
email: ""
photo: "member-name.jpg"
date: "2026-08"
homepage: ""
googleScholar: ""
linkedin: ""
github: ""
bio: ""
research_interests: ["Research Area 1", "Research Area 2"]
---
```

### Alumni Template

```yaml
---
name: "Name"
position: "Alumni"
graduation: "M.S. 2026"
email: ""
photo: "member-name.jpg"
homepage: ""
googleScholar: ""
linkedin: ""
github: ""
bio: ""
research_interests: []
---
```

## Image Storage

- Member photos belong in `static/images/members/`.
- Frontmatter should store only filenames, for example `photo: "member-name.jpg"`.
- Do not store public paths such as `photo: "/images/members/member-name.jpg"` in member frontmatter.
- Prefer ASCII filenames with lowercase letters, numbers, and hyphens.
