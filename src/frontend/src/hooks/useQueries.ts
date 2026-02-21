import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Article, XPost, Spotlight, Wisdom, Resource } from '../backend';
import { ExternalBlob } from '../backend';

// Latest Progress Articles
export function useGetAllArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      console.log('[useGetAllArticles] Query function called', { actorReady: !!actor });
      if (!actor) {
        console.log('[useGetAllArticles] Actor not ready, returning empty array');
        return [];
      }
      const articles = await actor.getAllArticles();
      console.log('[useGetAllArticles] Fetched articles', { count: articles.length });
      return articles;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url, thumbnail }: { title: string; url: string; thumbnail: ExternalBlob }) => {
      console.log('[useAddArticle] Mutation function started', { 
        timestamp: new Date().toISOString(),
        title, 
        url, 
        thumbnailType: typeof thumbnail,
        hasThumbnail: !!thumbnail,
        actorReady: !!actor
      });

      if (!actor) {
        console.error('[useAddArticle] Actor not available in mutation function');
        throw new Error('Backend connection not ready. Please wait a moment and try again.');
      }

      console.log('[useAddArticle] About to call actor.addArticle');
      try {
        const result = await actor.addArticle(title, url, thumbnail);
        console.log('[useAddArticle] actor.addArticle completed successfully', { 
          result,
          timestamp: new Date().toISOString() 
        });
        return result;
      } catch (error) {
        console.error('[useAddArticle] actor.addArticle failed', { 
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useAddArticle] Mutation onSuccess callback - invalidating articles query');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
    onError: (error) => {
      console.error('[useAddArticle] Mutation onError callback', { 
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

// X Posts
export function useGetAllXPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<XPost[]>({
    queryKey: ['xposts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllXPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddXPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ description, image }: { description: string; image: ExternalBlob }) => {
      console.log('[useAddXPost] Mutation invoked', { 
        timestamp: new Date().toISOString(),
        description, 
        imageType: typeof image,
        hasImage: !!image,
        actorReady: !!actor
      });

      if (!actor) {
        console.error('[useAddXPost] Actor not available');
        throw new Error('Backend connection not ready. Please wait a moment and try again.');
      }

      console.log('[useAddXPost] Calling actor.addXPost');
      try {
        await actor.addXPost(description, image);
        console.log('[useAddXPost] Backend call successful', { timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('[useAddXPost] Backend call failed', { 
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useAddXPost] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['xposts'] });
    },
  });
}

// Ecosystem Spotlights
export function useGetAllSpotlights() {
  const { actor, isFetching } = useActor();

  return useQuery<Spotlight[]>({
    queryKey: ['spotlights'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSpotlights();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSpotlight() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      console.log('[useAddSpotlight] Mutation invoked', { 
        timestamp: new Date().toISOString(),
        title, 
        content,
        actorReady: !!actor
      });

      if (!actor) {
        console.error('[useAddSpotlight] Actor not available');
        throw new Error('Backend connection not ready. Please wait a moment and try again.');
      }

      console.log('[useAddSpotlight] Calling actor.addSpotlight');
      try {
        await actor.addSpotlight(title, content);
        console.log('[useAddSpotlight] Backend call successful', { timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('[useAddSpotlight] Backend call failed', { 
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useAddSpotlight] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['spotlights'] });
    },
  });
}

// Investing Wisdom
export function useGetAllWisdom() {
  const { actor, isFetching } = useActor();

  return useQuery<Wisdom[]>({
    queryKey: ['wisdom'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWisdom();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWisdom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quote, author }: { quote: string; author: string }) => {
      console.log('[useAddWisdom] Mutation invoked', { 
        timestamp: new Date().toISOString(),
        quote, 
        author,
        actorReady: !!actor
      });

      if (!actor) {
        console.error('[useAddWisdom] Actor not available');
        throw new Error('Backend connection not ready. Please wait a moment and try again.');
      }

      console.log('[useAddWisdom] Calling actor.addWisdom');
      try {
        await actor.addWisdom(quote, author);
        console.log('[useAddWisdom] Backend call successful', { timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('[useAddWisdom] Backend call failed', { 
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useAddWisdom] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['wisdom'] });
    },
  });
}

// Trusted Resources
export function useGetAllResources() {
  const { actor, isFetching } = useActor();

  return useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, url }: { name: string; description: string; url: string }) => {
      console.log('[useAddResource] Mutation invoked', { 
        timestamp: new Date().toISOString(),
        name, 
        description,
        url,
        actorReady: !!actor
      });

      if (!actor) {
        console.error('[useAddResource] Actor not available');
        throw new Error('Backend connection not ready. Please wait a moment and try again.');
      }

      console.log('[useAddResource] Calling actor.addResource');
      try {
        await actor.addResource(name, description, url);
        console.log('[useAddResource] Backend call successful', { timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('[useAddResource] Backend call failed', { 
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useAddResource] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

// Cybercrime Articles
export function useGetAllCybercrimeArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['cybercrime-articles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCybercrimeArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCybercrimeArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url, thumbnail }: { title: string; url: string; thumbnail: ExternalBlob }) => {
      console.log('[useAddCybercrimeArticle] Mutation invoked', { 
        timestamp: new Date().toISOString(),
        title, 
        url, 
        thumbnailType: typeof thumbnail,
        hasThumbnail: !!thumbnail,
        actorReady: !!actor
      });

      if (!actor) {
        console.error('[useAddCybercrimeArticle] Actor not available');
        throw new Error('Backend connection not ready. Please wait a moment and try again.');
      }

      console.log('[useAddCybercrimeArticle] Calling actor.addCybercrimeArticle');
      try {
        await actor.addCybercrimeArticle(title, url, thumbnail);
        console.log('[useAddCybercrimeArticle] Backend call successful', { timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('[useAddCybercrimeArticle] Backend call failed', { 
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useAddCybercrimeArticle] Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['cybercrime-articles'] });
    },
  });
}
