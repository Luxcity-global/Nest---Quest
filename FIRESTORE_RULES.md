# Firestore Security Rules for NestQuest Blog

## Required Rules

To enable the blog functionality, add these rules to your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Blog Posts Collection
    match /blog_posts/{postId} {
      // Anyone can read published blog posts
      allow read: if resource.data.status == 'published';
      
      // Authenticated users can read all posts (including drafts)
      allow read: if request.auth != null;
      
      // Only authenticated users can create/update/delete blog posts
      // In production, add admin role check here
      allow create, update, delete: if request.auth != null;
    }
    
    // Properties Collection (existing)
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users Collection (existing)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## How to Apply

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **student-housing-ea907**
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the rules above
5. Click **Publish**

## After Applying Rules

Run the seed script to populate initial blog posts:

```bash
npm run seed:blog
```

## Production Considerations

For production, you should:

1. **Add Admin Role Check**: Modify the write rules to check for admin role:
   ```javascript
   allow create, update, delete: if request.auth != null && 
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
   ```

2. **Add Validation**: Ensure required fields are present:
   ```javascript
   allow create: if request.auth != null && 
     request.resource.data.keys().hasAll(['title', 'content', 'category', 'status']);
   ```

3. **Rate Limiting**: Consider implementing rate limiting for write operations

## Testing

After applying the rules and seeding data:

1. Navigate to the blog page (not logged in)
2. You should see all published posts
3. Log in and navigate to admin console
4. You should be able to create/edit blog posts
5. Drafts should only be visible in the admin console
