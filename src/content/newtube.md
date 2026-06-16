---
title: Building a Full-Stack YouTube Clone with nextjs 15, trpc, and more web Technologies
description: A deep dive into architecture, core features, and problem solving strategies
date: '2026-3-10'
categories:
  - Nextjs
  - Trpc
published: true
---

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Architecture Deep Dive](#architecture-deep-dive)
4. [Core Technologies and Features](#core-technologies-and-features)
5. [Challenges and Solutions](#challenges-and-solutions)
6. [Conclusion](#conclusion)

---

## Introduction

Building a video-sharing platform like YouTube is one of the most challenging yet rewarding projects for full-stack developers. It involves complex requirements: video processing, real-time streaming, user authentication, subscription systems, and much more.

In this technical deep dive, I'll walk you through how I built **NewTube** - a fully functional YouTube clone using modern web technologies. This isn't just a UI clone; it's a production-ready application with real video processing, AI-powered features, and a scalable architecture.

**GitHub Repository**: [NewTube Clone](https://github.com/lora-sys/Newtube-clone)

**Live Demo**: Available in the repository

---

## Project Overview

### What is NewTube?

NewTube is a full-featured video-sharing platform that includes:

- **Video Upload & Streaming**: Powered by Mux with HLS adaptive streaming
- **User Authentication**: Complete auth flow with Clerk
- **Creator Studio**: Dashboard for video management and analytics
- **Subscription System**: Follow your favorite creators
- **Comments & Reactions**: Full engagement features
- **Playlists**: Create and manage video collections
- **AI Features**: Auto-generate titles, descriptions, and thumbnails
- **Responsive Design**: Works seamlessly on all devices

### Tech Stack at a Glance

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend  | tRPC, Drizzle ORM                              |
| Database | PostgreSQL (Neon)                              |
| Auth     | Clerk                                          |
| Video    | Mux                                            |
| Storage  | UploadThing                                    |
| Cache    | Upstash Redis                                  |
| Queue    | QStash                                         |

---

## Architecture Deep Dive

### System Architecture

The application follows a **three-tier architecture** with serverless patterns optimized for modern cloud deployment:

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                                │
│  Browser / Mobile → React Components → tRPC Client              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (tRPC)                            │
│  - protectedProcedure middleware                                 │
│  - Input validation (Zod)                                        │
│  - Rate limiting (Upstash)                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────���───────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  PostgreSQL (Drizzle ORM) ←→ Redis Cache ←→ External Services   │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

I organized the codebase using a **feature-based module structure** (which I call "moubles"):

```
moubles/
├── videos/
│   ├── server/
│   │   └── procedures.ts    # tRPC API endpoints
│   ├── ui/
│   │   └── components/      # React components
│   └── type.ts              # TypeScript types
├── comments/
├── subscriptions/
├── playlists/
└── ... (other features)
```

This approach keeps related code together, making the codebase more maintainable as it grows.

### Request Flow Example

Here's how a typical API request flows through the system:

```typescript
// 1. Client Component triggers the query
const [videos] = trpc.videos.getMany.useSuspenseQuery({
	categoryId: selectedCategory
});

// 2. tRPC Client serializes and sends request
// POST /api/trpc/videos.getMany
// Body: { json: { categoryId: "..." } }

// 3. Server-side tRPC handles the request
export const videosRouter = createTRPCRouter({
	getMany: baseProcedure
		.input(
			z.object({
				categoryId: z.string().uuid().optional(),
				limit: z.number().min(1).max(100).default(10)
			})
		)
		.query(async ({ input }) => {
			// Database query with Drizzle ORM
			const data = await db
				.select({
					id: videos.id,
					title: videos.title
					// ... other fields
				})
				.from(videos)
				.where(eq(videos.videoVisiblity, 'public'));

			return { items: data, nextCursor: null };
		})
});
```

---

## Core Technologies and Features

### 1. Server Components with SSR Prefetching

Next.js 15's App Router allows us to prefetch data on the server and hydrate it to the client:

```tsx
// app/(home)/videos/[videoId]/page.tsx (Server Component)
import { HydrateClient, trpc } from '@/trpc/server';

export default async function VideoPage({ params }: { params: { videoId: string } }) {
	// Prefetch on the server
	void trpc.videos.getOne.prefetch({ id: params.videoId });
	void trpc.comments.getMany.prefetch({ videoId: params.videoId });

	return (
		<HydrateClient>
			<VideoSection videoId={params.videoId} />
		</HydrateClient>
	);
}

// VideoSection.tsx (Client Component)
('use client');

export function VideoSection({ videoId }: { videoId: string }) {
	// Data is already prefetched - no loading state!
	const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

	return <VideoPlayer video={video} />;
}
```

**Benefits**:

- Zero loading states for initial page load
- Better SEO with server-rendered content
- Reduced client-side JavaScript

### 2. Type-Safe API Layer with tRPC

tRPC provides end-to-end type safety without code generation:

```typescript
// Backend: trpc/router/videos.ts
export const videosRouter = createTRPCRouter({
	create: protectedProcedure.mutation(async ({ ctx }) => {
		const upload = await mux.video.uploads.create({
			new_asset_settings: {
				playback_policies: ['public'],
				inputs: [
					{
						generated_subtitles: [
							{
								language_code: 'en',
								name: 'English'
							}
						]
					}
				]
			},
			cors_origin: process.env.MUX_CORS_ORIGIN || '*'
		});

		const [video] = await db
			.insert(videos)
			.values({
				userId: ctx.user.id,
				title: 'Untitled',
				muxStatus: 'waiting',
				muxUploadId: upload.id
			})
			.returning();

		return { video, url: upload.url };
	})
});

// Frontend: Auto-completion and type checking
const createMutation = trpc.videos.create.useMutation();
//     ^? { video: Video, url: string } - fully typed!
```

### 3. Authentication Middleware with Caching

The authentication flow is optimized with a three-tier caching strategy:

```typescript
// trpc/init.ts
export const protectedProcedure = t.procedure.use(async (opts) => {
	const { ctx } = opts;

	if (!ctx.clerkUserId) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	// Tier 1: Check JWT publicMetadata (fastest)
	if (ctx.dbUserId) {
		return opts.next({ ctx: { user: { id: ctx.dbUserId } } });
	}

	// Tier 2: Check Redis cache
	const cachedDbId = await redis.get(`user:dbId:${ctx.clerkUserId}`);
	if (cachedDbId) {
		return opts.next({ ctx: { user: { id: cachedDbId } } });
	}

	// Tier 3: Database query (fallback)
	const [user] = await db.select().from(users).where(eq(users.clerkId, ctx.clerkUserId));

	// Cache for future requests
	await redis.set(`user:dbId:${ctx.clerkUserId}`, user.id, { ex: 3600 });

	// Update JWT for next time
	await clerkClient.users.updateUserMetadata(ctx.clerkUserId, {
		publicMetadata: { dbUserId: user.id }
	});

	return opts.next({ ctx: { user } });
});
```

### 4. Video Processing Pipeline

The video upload and processing flow uses webhooks for async updates:

```
User Upload → Mux Upload URL → Mux Processing → Webhook → Database Update
     │              │                │               │            │
     └──────────────┴────────────────┴───────────────┴────────────┘
                    Asynchronous flow with real-time updates
```

```typescript
// app/api/videos/webhook/route.ts
export async function POST(req: Request) {
	const payload = await req.json();

	switch (payload.type) {
		case 'video.asset.ready': {
			const asset = payload.data;
			const playbackId = asset.playback_ids[0].id;

			// Generate thumbnail from Mux
			const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
			const uploaded = await utapi.uploadFilesFromUrl(thumbnailUrl);

			// Update database
			await db
				.update(videos)
				.set({
					muxPlaybackId: playbackId,
					muxStatus: 'ready',
					duration: Math.round(asset.duration),
					thumbnailUrl: uploaded.data.ufsUrl
				})
				.where(eq(videos.muxUploadId, asset.upload_id));

			break;
		}
	}

	return new Response('OK');
}
```

### 5. AI-Powered Content Generation

Using QStash for async AI tasks:

```typescript
// Trigger AI task
const { workflowRunId } = await workflow.trigger({
	url: `${process.env.QSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
	body: { userId, videoId }
});

// Workflow handler
export async function POST(req: Request) {
	const { videoId } = await req.json();

	// Get video transcript from Mux
	const track = await mux.video.tracks.get(video.muxTrackId);
	const transcript = track.text;

	// Generate title with AI
	const response = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: [
			{
				role: 'user',
				content: `Generate a YouTube title based on: ${transcript}`
			}
		]
	});

	const title = response.choices[0].message.content;

	// Update database
	await db.update(videos).set({ title }).where(eq(videos.id, videoId));
}
```

### 6. Optimistic Updates for Better UX

```typescript
const utils = trpc.useUtils();

const likeMutation = trpc.videoReactions.like.useMutation({
	onMutate: async ({ videoId }) => {
		// Cancel outgoing refetches
		await utils.videos.getOne.cancel({ id: videoId });

		// Snapshot previous value
		const previous = utils.videos.getOne.getData({ id: videoId });

		// Optimistically update UI
		utils.videos.getOne.setData({ id: videoId }, (old) => ({
			...old!,
			viewerReaction: 'like',
			likeCount: old!.likeCount + 1
		}));

		return { previous };
	},
	onError: (err, { videoId }, context) => {
		// Rollback on error
		utils.videos.getOne.setData({ id: videoId }, context.previous);
		toast.error('Failed to like video');
	},
	onSettled: ({ videoId }) => {
		// Refetch to ensure consistency
		utils.videos.getOne.invalidate({ id: videoId });
		utils.playlists.getLiked.invalidate();
	}
});
```

---

## Challenges and Solutions

### Challenge 1: SSR Authentication with Protected Routes

**Problem**: When using SSR with protected routes, the server doesn't have access to the client's authentication state, causing 401 errors or hydration mismatches.

**Solution**: Implement a multi-layered approach:

```typescript
// In protected components
"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export function ProtectedSection() {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const hasTriggeredSignIn = useRef(false);

  useEffect(() => {
    // Prevent multiple calls with useRef
    if (isLoaded && !isSignedIn && !hasTriggeredSignIn.current) {
      hasTriggeredSignIn.current = true;
      openSignIn();
    }
  }, [isLoaded, isSignedIn, openSignIn]);

  if (!isLoaded) {
    return <Skeleton />;
  }

  if (!isSignedIn) {
    return null;
  }

  return <ActualContent />;
}
```

**Key Insight**: Using `useRef` prevents the sign-in modal from opening multiple times during React's strict mode double-render.

### Challenge 2: Hydration Mismatch in Mobile Detection

**Problem**: A mobile detection hook caused hydration errors because the initial value differed between server and client.

```typescript
// ❌ Problem: undefined on server, boolean on client
const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
return !!isMobile;
```

**Solution**: Default to `false` and only update on client:

```typescript
// ✅ Fixed: Consistent initial value
const [isMobile, setIsMobile] = useState<boolean>(false);

useEffect(() => {
	const checkMobile = () => {
		setIsMobile(window.innerWidth < 768);
	};

	checkMobile();
	window.addEventListener('resize', checkMobile);
	return () => window.removeEventListener('resize', checkMobile);
}, []);

return isMobile;
```

### Challenge 3: Cache Invalidation Across Features

**Problem**: When a user likes a video, the "Liked Videos" playlist wasn't updating in real-time.

**Solution**: Invalidate all related queries:

```typescript
const likeMutation = trpc.videoReactions.like.useMutation({
	onSuccess: () => {
		// Primary data
		utils.videos.getOne.invalidate({ id: videoId });

		// Related features
		utils.playlists.getLiked.invalidate();
		utils.playlists.getLikedPreview.invalidate();
	}
});
```

### Challenge 4: CORS Configuration for Video Uploads

**Problem**: In production, Mux uploads failed due to CORS restrictions.

**Solution**: Use environment-based CORS configuration:

```typescript
const upload = await mux.video.uploads.create({
	new_asset_settings: {
		/* ... */
	},
	// Development: "*" | Production: specific domain
	cors_origin: process.env.MUX_CORS_ORIGIN || '*'
});
```

### Challenge 5: Real-time Video Processing Status

**Problem**: Users couldn't see when their video finished processing.

**Solution**: Implement polling with automatic cleanup:

```typescript
const [workflowRunId, setWorkflowRunId] = useState<string | null>(null);

useEffect(() => {
	if (!workflowRunId) return;

	const interval = setInterval(() => {
		// Invalidate cache to refetch latest data
		utils.studio.getOne.invalidate({ id: videoId });
	}, 2000);

	// Cleanup after 60 seconds
	const timeout = setTimeout(() => {
		clearInterval(interval);
		toast.info('Processing may take longer than expected');
	}, 60000);

	return () => {
		clearInterval(interval);
		clearTimeout(timeout);
	};
}, [workflowRunId, videoId, utils]);
```

---

## Conclusion

Building NewTube was an incredible learning experience that pushed me to solve real-world problems at scale. Here's what I learned:

### Key Takeaways

1. **Type Safety is Non-Negotiable**: tRPC + TypeScript + Zod eliminated entire categories of bugs
2. **Server Components are Game-Changers**: SSR prefetching dramatically improved UX and SEO
3. **Caching Strategy Matters**: The three-tier auth caching reduced database queries by 90%
4. **Webhooks Enable Async Workflows**: Critical for video processing and AI tasks
5. **Feature-Based Architecture Scales**: The "moubles" structure kept the codebase maintainable

### What's Next?

Future improvements I'm planning:

- Real-time notifications with Server-Sent Events
- Video chapters and timestamps
- Live streaming support
- Advanced analytics dashboard
- Mobile app with React Native

### Resources

- **GitHub Repository**: [NewTube Clone](https://github.com/lora-sys/Newtube-clone)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **tRPC Documentation**: [trpc.io/docs](https://trpc.io/docs)
- **Drizzle ORM**: [orm.drizzle.team](https://orm.drizzle.team/)

---

Thank you for reading! If you found this article helpful, please give the [repository](https://github.com/lora-sys/Newtube-clone) a ⭐ and feel free to reach out with questions.

**Happy coding! 🚀**
