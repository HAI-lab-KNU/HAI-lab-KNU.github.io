# HAI Lab Website

Human-AI Interaction Lab's official website.
https://hai.kangwon.ac.kr/

## 📝 Content Update Guide

### **Adding New Projects**

#### 1. Create New Project Blog Post
```bash
# Create new folder in content/blog/
mkdir content/blog/project-name
```

#### 2. Create index.md file
```markdown
---
title: "Project Title"
date: "YYYY-MM-DD"
description: "Project description"

# Images (Optional)
thumbnail: "/images/project-image.png"
image1: "/images/image1.png"
image2: "/images/image2.png"

# Publication information
publications:
  - title: "Paper Title"
    authors: "Author1, Author2, Author3"
    venue: "Journal Name, Year"
    pdf: "/paper/paper-file.pdf"
    doi: "10.xxxx/xxxxx"  # If DOI exists
    video: "https://youtube.com/..."  # If video exists

# Dataset information
datasets:
  - title: "Dataset Name"
    description: "Dataset description"
    zenodo: "https://zenodo.org/..."
    size: "Size"
    license: "License"

# Source code information
sourcecode:
  - title: "Code Name"
    description: "Code description"
    github: "https://github.com/..."
    language: "Python"
    framework: "Framework name"

# Research team information
people:
  - name: "Name"
    affiliation: "Affiliation"
    photo: "/images/members/photo.jpg"
    homepage: "https://..."
---
```

### **Adding New Publications**

#### 1. Create new file in Publications folder
```bash
# Create new file in content/publications/
touch content/publications/paper-name.md
```

#### 2. Write publication information
```markdown
---
title: "Paper Title"
authors: "Author1, Author2, Author3"
journal: "Journal Name"
type: "Journal"  # Journal, Conference, Poster
year: "2024"
date: "2024-01-01"
doi: "10.xxxx/xxxxx"  # DOI link
paper: "/paper/paper-file.pdf"
slide: "/slides/slides.pdf"  # Optional
video: "https://youtube.com/..."  # Optional
tags: ["Top Conference"]  # If it's a top conference
award: "Award Name"  # If awarded
---
```

### **Adding Course Information**

#### 1. Create new file in Lectures folder
```bash
# Create new file in content/lectures/
touch content/lectures/course-name.md
```

#### 2. Write course information
```markdown
---
title: "Course Title"
semester: "2024-1"
description: "Course description"
instructor: "Instructor Name"
credits: "3"
schedule: "Tue Thu 10:30-11:45"
location: "Classroom"
syllabus: "/files/syllabus.pdf"
---
```

### **Adding Lab Members**

Member frontmatter is the member database schema. See [Content Schema](docs/content-schema.md#members) for required fields, optional fields, allowed `position` values, and ordering rules.

#### 1. Create new file in Members folder
```bash
# Create new file in content/members/
touch content/members/member-name.md
```

#### 2. Write member information
```markdown
---
name: "Name"
position: "M.S Student"  # Professor, Ph.D Student, M.S Student, Undergraduate Student, Alumni
email: "email@example.com"
photo: "member-name.jpg"
date: "2026-08"
homepage: "https://..."
googleScholar: "https://scholar.google.com/..."
linkedin: "https://www.linkedin.com/in/..."
github: "https://github.com/..."
bio: "Short biography"
research_interests: ["Research Area 1", "Research Area 2", "Research Area 3", "Research Area 4"]
---
```

- `photo` should be a filename only. Put the image file in `static/images/members/`.
- `date` is optional and can be used as a start month for ordering, using `YYYY-MM`.
- Leave optional fields as empty strings if they should not be shown.
- Alumni can use `graduation`, for example `graduation: "M.S. 2026"`.

### **Adding News**

#### 1. Create new file in News folder
```bash
# Create new file in content/news/
touch content/news/news-title.md
```

#### 2. Write news information
```markdown
---
title: "News Title"
date: "2024-01-01"
description: "News summary"
content: "News content"
image: "/images/news/news-image.jpg"
---
```

### **Adding Images**

#### 1. Place image files
```bash
# Project images
cp image-file.jpg static/images/

# Member photos
cp member-photo.jpg static/images/members/

# Paper PDFs
cp paper.pdf static/paper/
```

#### 2. Image usage
```markdown
# Thumbnail
thumbnail: "/images/image-name.jpg"

# Single image
image1: "/images/image1.jpg"

# Multiple images
image1: "/images/image1.jpg"
image2: "/images/image2.jpg"
image3: "/images/image3.jpg"
```

### **After Update Checklist**

1. **Restart Gatsby development server**
```bash
npm run develop
```

2. **Verify content displays correctly**
   - Check if new content appears in menus
   - Verify images load properly
   - Confirm links work correctly

3. **Commit and push changes**
```bash
git add .
git commit -m "feat: add new content"
git push
```

### **Important Notes**

- **Filenames**: Use only English, numbers, and hyphens (-). Avoid Korean, spaces, and special characters
- **Image formats**: JPG, PNG, GIF supported
- **PDF size**: Avoid uploading extremely large files
- **DOI links**: Enter accurate DOI for paper title click navigation
- **Metadata**: Fill in all frontmatter fields correctly

### **File Naming Convention**

- **Projects**: `project-name` (e.g., `ai-complaint-classification`)
- **Publications**: `Paper-Title-With-Hyphens.md` (e.g., `Interrupting-for-Microlearning.md`)
- **Members**: `member-name.md` (e.g., `aukkim.md`)
- **Images**: `image-name.jpg` (e.g., `smart-speaker.png`)

### **Common Issues & Solutions**

- **Content not appearing**: Check frontmatter syntax and restart dev server
- **Images not loading**: Verify file path and image format
- **Links not working**: Ensure correct URL format and DOI syntax
- **Build errors**: Check markdown syntax and required fields
