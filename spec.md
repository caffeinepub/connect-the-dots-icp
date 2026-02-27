# Specification

## Summary
**Goal:** Add a header photo field to Ecosystem Spotlight entries, enabling admins to upload and display a banner image for each spotlight card.

**Planned changes:**
- Update the backend Spotlight data model to include an optional image blob field, consistent with how other image fields are stored
- Update the AddSpotlightDialog to include a required header photo upload field at the top of the form, with upload progress and validation
- Update the EditSpotlightDialog to preview the current header photo and allow admins to upload a replacement, preserving the existing photo if none is uploaded
- Update the EcosystemSpotlight display component to render each spotlight's header photo as a full-width banner at the top of the card, before the title and content, with a styled placeholder for cards without a photo

**User-visible outcome:** Each Ecosystem Spotlight card displays a prominent full-width header photo at the top. Admins must upload a photo when creating a new spotlight and can replace it when editing an existing one.
