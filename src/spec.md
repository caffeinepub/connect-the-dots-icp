# Specification

## Summary
**Goal:** Fix the broken article upload functionality in the AddArticleDialog component to restore the ability to submit and store articles.

**Planned changes:**
- Debug and fix the article form submission flow from frontend to backend
- Verify backend addArticle function correctly receives and stores article data
- Ensure frontend mutation properly invokes backend actor with correct parameters
- Fix actor initialization and readiness checks before form submission
- Restore success notifications and form clearing after submission

**User-visible outcome:** Users can successfully upload articles with title, URL, and thumbnail. Articles appear immediately in the Latest Progress tab after submission with success notifications displayed.
