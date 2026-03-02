import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';

const BLOG_POSTS_COLLECTION = 'blog_posts';

/**
 * Fetch all published blog posts
 */
export const fetchPublishedBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const q = query(
            collection(db, BLOG_POSTS_COLLECTION),
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const posts: BlogPost[] = [];

        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        return posts;
    } catch (error) {
        console.error('Error fetching published blog posts:', error);
        throw error;
    }
};

/**
 * Fetch all blog posts (including drafts) - for admin use
 */
export const fetchAllBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const q = query(
            collection(db, BLOG_POSTS_COLLECTION),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const posts: BlogPost[] = [];

        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() } as BlogPost);
        });

        return posts;
    } catch (error) {
        console.error('Error fetching all blog posts:', error);
        throw error;
    }
};

/**
 * Create a new blog post
 */
export const createBlogPost = async (post: Omit<BlogPost, 'id'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, BLOG_POSTS_COLLECTION), {
            ...post,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log('Blog post created with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<void> => {
    try {
        const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
        await updateDoc(docRef, {
            ...post,
            updatedAt: serverTimestamp()
        });

        console.log('Blog post updated:', id);
    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
};

/**
 * Delete a blog post
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, BLOG_POSTS_COLLECTION, id));
        console.log('Blog post deleted:', id);
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time blog post updates
 * @param callback Function to call when posts are updated
 * @param includesDrafts Whether to include draft posts (for admin)
 * @returns Unsubscribe function
 */
export const subscribeToBlogPosts = (
    callback: (posts: BlogPost[]) => void,
    includeDrafts: boolean = false,
    onError?: (error: any) => void
): (() => void) => {
    const q = includeDrafts
        ? query(collection(db, BLOG_POSTS_COLLECTION), orderBy('createdAt', 'desc'))
        : query(
            collection(db, BLOG_POSTS_COLLECTION),
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc')
        );

    return onSnapshot(q, (querySnapshot) => {
        const posts: BlogPost[] = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        callback(posts);
    }, (error) => {
        console.error('Error in blog posts subscription:', error);
        if (onError) onError(error);
    });
};

/**
 * Seed a blog post with a specific ID
 */
export const seedBlogPost = async (post: BlogPost): Promise<void> => {
    try {
        const { id, ...data } = post;
        const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
        await setDoc(docRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log('Blog post seeded:', id);
    } catch (error) {
        console.error('Error seeding blog post:', error);
        throw error;
    }
};
